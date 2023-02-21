package com.tap.appointments;

import com.tap.company.CompanyDAO;
import com.tap.db.dto.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoField;
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

		LocalDateTime fromDT = Utils.parseDT(from).orElse(LocalDateTime.now());
		LocalDateTime toDT = Utils.parseDT(to).orElse(LocalDate.from(fromDT).plus(Utils.DAYS_TO_GET_FOR_FREE_APPS, ChronoUnit.DAYS).atTime(LocalTime.MAX));

		List<EmployeeDTO> employees = companyDAO.employeesForServices(cityId, Utils.parseIDs(sIds), cId);

		if (!employees.isEmpty()) {
			List<Long> eIds = employees.stream().map(EmployeeDTO::getId).toList();
			List<AppointmentDTO> apps = appointmentsDAO.getAppointments(fromDT, toDT, eIds);
			List<EmployeeWorkDayDTO> employeesWorkDays = companyDAO.getEmployeesWorkDays(eIds);

			for (EmployeeDTO e : employees) {
				long eId = e.getId();

				List<TimePeriod> ePeriods = new ArrayList<>();

				fromDT.toLocalDate()
						.datesUntil(toDT.toLocalDate())
						.forEach(d -> employeesWorkDays.stream()
								.filter(eWD -> eWD.getEmployeeId() == eId && eWD.getStartDay() == d.getDayOfWeek().getValue())
								.forEach(eWD -> {
											ePeriods.add(TimePeriod.ofEmployeeWorkDate(d, eWD));
											if (eWD.hasBreak())
												ePeriods.add(TimePeriod.ofEmployeeBrake(d, eWD));
										}
								)
						);
				ePeriods.addAll(apps.stream()
						.filter(a -> a.getEmployeeId() == eId)
						.map(TimePeriod::ofAppointment)
						.sorted(Comparator.comparing(TimePeriod::getStart))
						.toList()
				);

				int duration = e.getLookingServices().stream().mapToInt(ServiceDTO::getDuration).sum();

				generateFreePeriods(ePeriods, duration);

				List<TimePeriod> freeApps = ePeriods.stream()
						.filter(p -> p.getType().equals(TimePeriod.FREE) && p.getSubType().equals(TimePeriod.FREE_APPOINTMENT))
						.toList();

				e.setPeriods(freeApps);

			}
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
		System.out.println(cId + " " + from + " " + to);

		LocalDate fromD = Utils.parseT(from).orElse(LocalDate.now());
		LocalDate toD = Utils.parseT(to).orElse(fromD.plus(Utils.DAYS_TO_GET, ChronoUnit.DAYS));
		List<LocalDate> dates = fromD.datesUntil(toD).toList();

		List<EmployeeDTO> employees = companyDAO.employeesOfCompany(cId);

		if (!employees.isEmpty()) {
			List<Long> eIds = employees.stream().map(EmployeeDTO::getId).toList();
			List<EmployeeWorkDayDTO> employeesWorkDays = companyDAO.getEmployeesWorkDays(eIds);
			List<AppointmentDTO> apps = appointmentsDAO.getAppointments(fromD.atTime(LocalTime.MIN), toD.atTime(LocalTime.MAX), eIds);

			if (!employeesWorkDays.isEmpty()) {
				for (LocalDate date : dates) {
					int day = date.getDayOfWeek().getValue();

					for (EmployeeDTO e : employees) {
						long eId = e.getId();
						CalendarDayDTO calendarDay = e.getCalendarDay(date);
						List<EffectiveEmployeeWorkDayDTO> effectiveWD = employeesWorkDays.stream()
								.filter(emWD -> emWD.getEmployeeId() == eId && emWD.getStartDay() == day)
								.map(wd -> new EffectiveEmployeeWorkDayDTO(
										e.getId(),
										LocalDateTime.of(date, wd.getStartTime()),
										LocalDateTime.of(date, wd.getEndTime()),
										wd.getBreakStartTime() != null ? LocalDateTime.of(date, wd.getBreakStartTime()) : null,
										wd.getBreakEndTime() != null ? LocalDateTime.of(date, wd.getBreakEndTime()) : null)
								).toList();

						if (!effectiveWD.isEmpty()) {
							effectiveWD.forEach(effWD -> {
								calendarDay.addTimePeriod(new TimePeriod(
										effWD.getStart(),
										effWD.getEnd(),
										TimePeriod.FREE,
										TimePeriod.FREE_WORK_HOURS
								));
								if (effWD.getBreakStart() != null && effWD.getBreakEnd() != null) {
									calendarDay.addTimePeriod(new TimePeriod(
											effWD.getBreakStart(),
											effWD.getBreakEnd(),
											TimePeriod.BUSY,
											TimePeriod.BUSY_BREAK
									));
								}
							});

							apps.stream()
									.filter(a -> a.getEmployeeId() == eId && (a.getStart().toLocalDate().isEqual(date) || a.getEnd().toLocalDate().isEqual(date)))
									.forEach(a -> calendarDay.addTimePeriod(new TimePeriod(a.getStart(), a.getEnd(), TimePeriod.BUSY, TimePeriod.BUSY_APPOINTMENT)));

							calendarDay.getPeriods().sort(Comparator.comparing(TimePeriod::getStart));

							//Add free time periods
							List<TimeDot> timeDots = new ArrayList<>();
							for (TimePeriod period : calendarDay.getPeriods()) {
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
										calendarDay.addTimePeriod(new TimePeriod(lastFreeOpen, tD.getDateTime(), TimePeriod.FREE, TimePeriod.FREE_PERIOD));
									closeDotCounter++;
								}
							}

						} else {
							e.addTimePeriod(date, null);
						}
					}
				}
			}
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

	private static void generateFreePeriods(List<TimePeriod> timePeriods, int splitByMinutes) {
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
				if (closeDotCounter == 0 && lastFreeOpen != null) {
					int freePeriod = Math.toIntExact(ChronoUnit.MINUTES.between(lastFreeOpen, tD.getDateTime()));
					if (splitByMinutes > 0 && freePeriod >= splitByMinutes)
						generateFreeAppTimePeriods(timePeriods, splitByMinutes, lastFreeOpen, freePeriod);
					else
						timePeriods.add(new TimePeriod(lastFreeOpen, tD.getDateTime(), TimePeriod.FREE, TimePeriod.FREE_PERIOD));

				}
				closeDotCounter++;
			}
		}

		timePeriods.sort(Comparator.comparing(TimePeriod::getStart));
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
