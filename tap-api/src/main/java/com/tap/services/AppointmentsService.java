package com.tap.services;

import com.tap.common.TimeDot;
import com.tap.common.TimePeriod;
import com.tap.db.dao.AppointmentsDAO;
import com.tap.db.dao.CompanyDAO;
import com.tap.db.entity.Appointment;
import com.tap.db.entity.EmployeeWorkDay;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAccessor;
import java.time.temporal.TemporalUnit;
import java.util.*;

@Path("appointments")
public class AppointmentsService {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Object getAppointments(@QueryParam("cId") long companyId, @QueryParam("y") int y, @QueryParam("m") int m, @QueryParam("d") int d) {

		LocalDate date = LocalDate.of(y, m, d);

		List<TimePeriod> resp = new ArrayList<>();

		List<Appointment> apps = appointmentsDAO.getAppointments(companyId, date);
		if (!apps.isEmpty()) {
			List<EmployeeWorkDay> eWD = companyDAO.getEmployeesWorkDayInfo(companyId, date.getDayOfWeek().getValue());
			if (!eWD.isEmpty()) {

				List<TimeDot> timeDots = new ArrayList<>();
				timeDots.add(new TimeDot(LocalTime.of(8, 0).get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
				for (Appointment a : apps) {
					timeDots.add(new TimeDot(a.getStartTime().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));
					timeDots.add(new TimeDot(a.getEndTime().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
					resp.add(new TimePeriod(a.getStartTime(), a.getEndTime(), TimePeriod.TYPE_BUSY));
				}
				timeDots.add(new TimeDot(LocalTime.of(22, 0).get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));

				int tmpFPStart = -1, closedDotCounter = 0;

				for (TimeDot tD : timeDots) {
					if (tD.type() == TimeDot.FREE_OPEN) {
						if (closedDotCounter > 0)
							closedDotCounter--;
						if (closedDotCounter == 0)
							tmpFPStart = tD.timeInDay();
					} else if (tD.type() == TimeDot.FREE_CLOSE) {
						if (closedDotCounter == 0 && tmpFPStart < tD.timeInDay())
							resp.add(new TimePeriod(
									date.atStartOfDay().plus(tmpFPStart, ChronoUnit.MINUTES),
									date.atStartOfDay().plus(tD.timeInDay(), ChronoUnit.MINUTES),
									TimePeriod.TYPE_FREE));
						closedDotCounter++;
					}
				}
			}
		}
		resp.sort(Comparator.comparing(TimePeriod::start));

		return resp;
	}

}
