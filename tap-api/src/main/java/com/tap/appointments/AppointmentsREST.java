package com.tap.appointments;

import com.tap.company.CompanyDAO;
import com.tap.db.dto.*;
import com.tap.db.entity.WEmployeeWD;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Path("appointments")
@RequestScoped
public class AppointmentsREST {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;
	@Inject
	private AppointmentController appointmentController;

	@GET
	@Path("/free")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getFreeAppointments(
			@QueryParam("cityId") long cityId,
			@QueryParam("sIds") String sIds,
			@QueryParam("cId") long cId,
			@QueryParam("from") String from,
			@QueryParam("to") String to
	) {

		List<EmployeeDTO> employees = companyDAO.employeesForServices(cityId, Utils.parseIDs(sIds), cId);
		LocalDateTime fromDT = Utils.parseDT(from).orElse(LocalDateTime.now());
		LocalDateTime toDT = Utils.parseDT(to).orElse(fromDT.toLocalDate().plus(Utils.FREE_APP_DAYS, ChronoUnit.DAYS).atTime(LocalTime.MAX));
		System.out.println(fromDT + " " + toDT);
		if (!employees.isEmpty()) {
			this.addCalendarTimePeriods(employees, fromDT, toDT);
			//int duration = e.getLookingServices().stream().mapToInt(ServiceDTO::getDuration).sum();
		}

		return Map.of("employees", employees);
	}

	@GET
	@Path("/calendar")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getAppointmentsCalendar(
			@QueryParam("cId") long cId,
			@QueryParam("from") String from,
			@QueryParam("to") String to
	) {
		List<EmployeeDTO> employees = companyDAO.employeesOfCompany(cId);

		if (!employees.isEmpty()) {
			LocalDate fromD = Utils.parseDate(from).orElse(LocalDate.now());
			LocalDate toD = Utils.parseDate(to).orElse(fromD.plus(1, ChronoUnit.DAYS));
			this.addCalendarTimePeriods(employees, fromD.atTime(LocalTime.MIN), toD.atTime(LocalTime.MAX));
		}

		return Map.of("employees", employees);
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
		List<Long> srvcs = Arrays.stream(services.split("_")).map(Long::parseLong).toList();
		appointmentsDAO.bookAppointment(srvcs, uId, eId, LocalDateTime.parse(start), LocalDateTime.parse(end));
		return true;
	}


	private void addCalendarTimePeriods(List<EmployeeDTO> employees, LocalDateTime from, LocalDateTime to) {

		List<Long> eIds = employees.stream().map(EmployeeDTO::getId).toList();
		List<AppointmentDTO> apps = appointmentsDAO.getAppointments(from, to, eIds);
		List<WEmployeeWD> employeesWorkDays = companyDAO.getEffEmployeesWorkDays(eIds);

		long eId;
		List<TimePeriod> periods;
		CalendarDayDTO cD;
		List<LocalDate> dates = from
				.toLocalDate()
				.datesUntil(to.toLocalDate())
				.toList();


		for (EmployeeDTO e : employees) {
			eId = e.getId();
			e.setCalendar(new ArrayList<>());

			for (LocalDate d : dates) {
				cD = new CalendarDayDTO(d);
				periods = cD.getPeriods();

				generateWorkDayPeriods(d, employeesWorkDays, eId, periods);
				if (!periods.isEmpty()) {

					generateAppTimePeriods(apps, eId, periods);
					generateFreePeriods(periods);

					periods.sort(Comparator.comparing(TimePeriod::getStart));
				} else {
					cD.setWorking(false);
				}

				e.getCalendar().add(cD);
			}
			e.getCalendar().sort(Comparator.comparing(CalendarDayDTO::getDate));
		}
	}

	private static void generateFreePeriods(List<TimePeriod> timePeriods) {
		List<TimeDot> timeDots = new ArrayList<>();

		for (TimePeriod period : timePeriods) {
			if (period.getType().equals(TimePeriod.FREE)) {
				timeDots.add(new TimeDot(period.getStart(), TimeDot.FREE_OPEN, period));
				timeDots.add(new TimeDot(period.getEnd(), TimeDot.FREE_CLOSE, period));
			} else if (period.getType().equals(TimePeriod.BUSY)) {
				timeDots.add(new TimeDot(period.getStart(), TimeDot.FREE_CLOSE, period));
				timeDots.add(new TimeDot(period.getEnd(), TimeDot.FREE_OPEN, period));
			}
		}

		timeDots.sort(Comparator.comparing(TimeDot::getDateTime));

		int closeDotCounter = 0;
		LocalDateTime lastFreeOpen = null;

		for (TimeDot tD : timeDots) {
			if (tD.getType() == TimeDot.FREE_OPEN) {
				lastFreeOpen = tD.getDateTime();
				if (closeDotCounter > 0)
					closeDotCounter--;
			} else if (tD.getType() == TimeDot.FREE_CLOSE) {
				if (closeDotCounter == 0 && lastFreeOpen != null)
					timePeriods.add(new TimePeriod(lastFreeOpen, tD.getDateTime(), TimePeriod.FREE, TimePeriod.FREE_PERIOD));
//					int freePeriod = Math.toIntExact(ChronoUnit.MINUTES.between(lastFreeOpen, tD.getDateTime()));
//					if (splitByMinutes > 0 && freePeriod >= splitByMinutes)
//						generateFreeAppTimePeriods(timePeriods, splitByMinutes, lastFreeOpen, freePeriod);
//					else
//						timePeriods.add(new TimePeriod(lastFreeOpen, tD.getDateTime(), TimePeriod.FREE, TimePeriod.FREE_PERIOD));


				closeDotCounter++;
			}
		}
	}

	private static void generateWorkDayPeriods(LocalDate d, List<WEmployeeWD> employeesWorkDays, long eId, List<TimePeriod> periods) {
		employeesWorkDays
				.stream()
				.filter(eWD -> eWD.getEmployeeId() == eId && eWD.getStartDay() == d.getDayOfWeek().getValue())
				.forEach(eWD -> {
							periods.add(TimePeriod.ofEmployeeWorkDate(d, eWD));
							if (eWD.getBreakStartDay() != null && eWD.getBreakStartTime() != null && eWD.getBreakEndDay() != null && eWD.getBreakEndTime() != null)
								periods.add(TimePeriod.ofEmployeeBrake(d, eWD));
						}
				);
	}

	private static void generateAppTimePeriods(List<AppointmentDTO> apps, long eId, List<TimePeriod> periods) {
		apps.stream()
				.filter(a -> a.getEmployeeId() == eId)
				.map(TimePeriod::ofAppointment)
				.forEach(periods::add);
	}

	private static void generateFreeAppTimePeriods(List<TimePeriod> timePeriods, int splitByMinutes, LocalDateTime lastFreeOpen, int freePeriod) {
		int freeApps = Math.toIntExact(freePeriod / splitByMinutes);
		for (int i = 0; i < freeApps; i++) {
			timePeriods.add(new TimePeriod(
					lastFreeOpen.plusMinutes((long) splitByMinutes * i),
					lastFreeOpen.plusMinutes(((long) splitByMinutes * i) + splitByMinutes),
					TimePeriod.FREE,
					TimePeriod.FREE_APPOINTMENT
			));
		}
		if (freePeriod % splitByMinutes > 0) {
			int restOfFree = freePeriod - (freeApps * splitByMinutes);
			timePeriods.add(new TimePeriod(
					lastFreeOpen.plusMinutes((long) splitByMinutes * freePeriod),
					lastFreeOpen.plusMinutes(((long) splitByMinutes * freePeriod) + restOfFree),
					TimePeriod.FREE,
					TimePeriod.FREE_APPOINTMENT
			));
		}

	}

}
