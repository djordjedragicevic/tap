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
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Path("appointments")
public class AppointmentsService {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Path("calendar")
	@Produces(MediaType.APPLICATION_JSON)
	public AppointmentsResp getAppointments(
			@QueryParam("cId") long companyId,
			@QueryParam("from") String from,
			int duration
	) {

		LocalDateTime dTFrom = LocalDateTime.parse(from, DateTimeFormatter.ISO_DATE_TIME);
		LocalDateTime dTTo = LocalDate.from(dTFrom).atTime(LocalTime.MAX);
		LocalDate dFrom = LocalDate.from(dTFrom);
		LocalDateTime startOfDay = dFrom.atStartOfDay();
		int day = dTFrom.getDayOfWeek().getValue();

		CompanyWorkDayDTO c = companyDAO.getCompanyWorkInfoAtDay(companyId, day);
		List<AppointmentDTO> apps = appointmentsDAO.getAppointments(companyId, dTFrom, dTTo);
		List<EmployeeWorkDayDTO> eWD = companyDAO.getEmployeesWorkInfoAtDay(companyId, day);
		List<AppointmentsResp.EmployeePeriod> periods = new ArrayList<>();
		apps.forEach(System.out::println);
		//Arrange appointments by user
		for (EmployeeWorkDayDTO e : eWD) {

			List<AppointmentDTO> userApps = apps.stream().filter(a -> a.employeeId() == e.getUserId()).toList();

			//Create BUSY TimePeriods
			List<TimePeriod> timePeriods = new ArrayList<>(userApps.stream().map(a -> new TimePeriod(a.startTime(), a.endTime(), TimePeriod.BUSY, TimePeriod.BUSY_APPOINTMENT)).toList());

			if (e.getBreakEnd().isAfter(e.getBreakStart()))
				timePeriods.add(new TimePeriod(LocalDateTime.of(dFrom, e.getBreakStart()), LocalDateTime.of(dFrom, e.getBreakEnd()), TimePeriod.BUSY, TimePeriod.BUSY_BREAK));
			else if (c.getBreakStart() != null && c.getBreakEnd() != null && c.getBreakEnd().isAfter(c.getBreakStart()))
				timePeriods.add(new TimePeriod(LocalDateTime.of(dFrom, c.getBreakStart()), LocalDateTime.of(dFrom, c.getBreakEnd()), TimePeriod.BUSY, TimePeriod.BUSY_BREAK));

			timePeriods.sort(Comparator.comparing(TimePeriod::getStart));

			//Create TimeDots from TimePeriods
			List<TimeDot> timeDots = new ArrayList<>();
			timeDots.add(new TimeDot(c.getStart().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
			timePeriods.forEach(tP -> {
				timeDots.add(new TimeDot(tP.getStart().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));
				timeDots.add(new TimeDot(tP.getEnd().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_OPEN));
			});
			timeDots.add(new TimeDot(c.getEnd().get(ChronoField.MINUTE_OF_DAY), TimeDot.FREE_CLOSE));

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
					if (closedDotCounter == 0 && tmpFPStart < tD.timeInDay()) {
						if (duration > 0) {
							int freeMinutes = tD.timeInDay() - tmpFPStart;
							int freeApps = freeMinutes / duration;
							for (int i = 0; i < freeApps; i++) {
								timePeriods.add(
										new TimePeriod(
												startOfDay.plus(tmpFPStart + ((long) duration * i), ChronoUnit.MINUTES),
												startOfDay.plus(tmpFPStart + ((long) duration * i) + duration, ChronoUnit.MINUTES),
												TimePeriod.FREE,
												TimePeriod.FREE_APPOINTMENT
										));
							}
							if (freeMinutes % duration > 0) {
								int restOfFree = freeMinutes - (freeApps * duration);
								timePeriods.add(new TimePeriod(
										startOfDay.plus(tmpFPStart + ((long) duration * freeApps), ChronoUnit.MINUTES),
										startOfDay.plus(tmpFPStart + ((long) duration * freeApps) + restOfFree, ChronoUnit.MINUTES),
										TimePeriod.FREE,
										TimePeriod.FREE_PERIOD
								));
							}

						} else {
							timePeriods.add(new TimePeriod(
									startOfDay.plus(tmpFPStart, ChronoUnit.MINUTES),
									startOfDay.plus(tD.timeInDay(), ChronoUnit.MINUTES),
									TimePeriod.FREE,
									TimePeriod.FREE_PERIOD));
						}
					}
					closedDotCounter++;
				}
			}
			timePeriods.sort(Comparator.comparing(TimePeriod::getStart));

			periods.add(new AppointmentsResp.EmployeePeriod(e, timePeriods));
		}

		return new AppointmentsResp(c, periods);
	}

	@GET
	@Path("/free")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getFreeAppointments(
			@QueryParam("services") String services,
			@QueryParam("cId") long cId,
			@QueryParam("from") String from,
			@QueryParam("to") String to
	) {

		List<Map<String, Object>> resp = new ArrayList<>();

		List<Long> serviceIds = Arrays.stream(services.split("_")).map(Long::valueOf).toList();
		List<Integer> serviceDurations = companyDAO.getServiceDurations(cId, serviceIds);
		if (!serviceDurations.isEmpty()) {
			int duration = serviceDurations.stream().reduce(Integer::sum).orElse(0);
			if (duration > 0) {
				LocalDateTime dTFrom = LocalDateTime.parse(from, DateTimeFormatter.ISO_DATE_TIME);
				return getAppointments(cId, from, duration);
			}
		}

		return resp;
	}

	@POST
	@Path("/book")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Transactional
	public Object bookFreeAppointment(
			@FormParam("services") String services,
			@FormParam("uId") long uId,
			@FormParam("eId") long eId,
			@FormParam("start") String start,
			@FormParam("end") String end
	) {
		List<Long> srvcs = Arrays.stream(services.split("_")).map(Long::valueOf).toList();
		appointmentsDAO.bookAppointment(srvcs, uId, eId, LocalDateTime.parse(start), LocalDateTime.parse(end));
		return true;
	}

}
