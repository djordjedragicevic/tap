package com.tap.appointments;

import com.tap.db.dao.CompanyDAO;
import com.tap.db.dto.CompanyWorkDayDTO;
import com.tap.db.dto.EmployeeWorkDayDTO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Path("appointments")
@RequestScoped
@Transactional
public class AppointmentsService {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Path("calendar")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getAppointments(
			@QueryParam("cId") long companyId,
			@QueryParam("y") int y,
			@QueryParam("m") int m,
			@QueryParam("d") int d
	) {

		LocalDate date = LocalDate.of(y, m, d);
		int day = date.getDayOfWeek().getValue();

		CompanyWorkDayDTO c = companyDAO.getCompanyWorkInfoAtDay(companyId, day);
		List<AppointmentDTO> apps = appointmentsDAO.getAppointments(companyId, date);

		List<Map<String, Object>> periods = new ArrayList<>();

		//Sort appointments by employee
		Map<Long, List<AppointmentDTO>> appsByEmployee = new HashMap<>();
		apps.forEach(a -> appsByEmployee.computeIfAbsent(a.employeeId(), k -> new ArrayList<>()).add(a));

		List<EmployeeWorkDayDTO> eWD = companyDAO.getEmployeesWorkInfoAtDay(companyId, day);

		//Arrange appointments by user
		for (EmployeeWorkDayDTO e : eWD) {

			List<AppointmentDTO> userApps = apps.stream().filter(a -> a.userId() == e.id()).toList();

			//Create BUSY TimePeriods
			List<TimePeriod> timePeriods = new ArrayList<>(userApps.stream().map(a -> new TimePeriod(a.startTime(), a.endTime(), TimePeriod.BUSY, TimePeriod.BUSY_STANDARD)).toList());

			if (e.breakEnd().isAfter(e.breakStart()))
				timePeriods.add(new TimePeriod(LocalDateTime.of(date, e.breakStart()), LocalDateTime.of(date, e.breakEnd()), TimePeriod.BUSY, TimePeriod.BUSY_BREAK));
			else if (c.breakStart() != null && c.breakEnd() != null && c.breakEnd().isAfter(c.breakStart()))
				timePeriods.add(new TimePeriod(LocalDateTime.of(date, c.breakStart()), LocalDateTime.of(date, c.breakEnd()), TimePeriod.BUSY, TimePeriod.BUSY_BREAK));

			timePeriods.sort(Comparator.comparing(TimePeriod::start));

			System.out.println("--------------------------");
			timePeriods.forEach(System.out::println);

			//Create TimeDots from TimePeriods
			List<TimeDot> timeDots = new ArrayList<>();
			timeDots.add(new TimeDot(c.start().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
			timePeriods.forEach(tP -> {
				timeDots.add(new TimeDot(tP.start().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));
				timeDots.add(new TimeDot(tP.end().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
			});
			timeDots.add(new TimeDot(c.end().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));

			int tmpFPStart = -1;
			int closedDotCounter = 0;

			//Analyze TimeDots and create FREE TimePeriods
			for (TimeDot tD : timeDots) {
				if (tD.type() == TimeDot.FREE_OPEN) {
					if (closedDotCounter > 0)
						closedDotCounter--;
					if (closedDotCounter == 0)
						tmpFPStart = tD.timeInDay();
				} else if (tD.type() == TimeDot.FREE_CLOSE) {
					if (closedDotCounter == 0 && tmpFPStart < tD.timeInDay())
						timePeriods.add(new TimePeriod(
								date.atStartOfDay().plus(tmpFPStart, ChronoUnit.MINUTES),
								date.atStartOfDay().plus(tD.timeInDay(), ChronoUnit.MINUTES),
								TimePeriod.FREE));
					closedDotCounter++;
				}
			}
			timePeriods.sort(Comparator.comparing(TimePeriod::start));

			periods.add(Map.of("employee", e, "periods", timePeriods));
		}

		return Map.of("company", c, "periods", periods);
	}

}
