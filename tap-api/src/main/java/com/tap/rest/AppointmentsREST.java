package com.tap.rest;

import com.tap.appointments.ProviderWorkInfo;
import com.tap.appointments.Utils;
import com.tap.auth.Public;
import com.tap.common.*;
import com.tap.db.dao.ProviderDAO;
import com.tap.db.entity.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.*;
import java.util.*;

@Path("appointments")
@RequestScoped
public class AppointmentsREST {

	public static class UserServicesMap {
		public Set<Integer> serviceIds = new HashSet<>();
		public int durationSum = 0;
		public int employeeId;
		public LocalDate date;
		public boolean isWorking = false;
		public List<TimePeriod> timePeriods = new ArrayList<>();
		public List<TimePeriod> workTime = new ArrayList<>();


		public UserServicesMap(int employeeId) {
			this.employeeId = employeeId;
		}

		public void addService(Service s, int dur) {
			if (!serviceIds.contains(s.getId())) {
				serviceIds.add(s.getId());
				durationSum += dur;
			}
		}

	}

	@Inject
	private ProviderDAO providerDAO;

	@GET
	@Path("free")
	@Public
	@Produces(MediaType.APPLICATION_JSON)
	public Object getFreeAppointments(
			@QueryParam("p") Integer pId,
			@QueryParam("s") String s,
			@QueryParam("d") String d
	) {
		Map<Integer, UserServicesMap> userServices = new LinkedHashMap<>();

		//Map employee and services on which they work
		List<Integer> sIds = Arrays.stream(s.split(",")).map(Integer::parseInt).toList();
		List<ServiceEmployee> sE = providerDAO.getEmployeesOnServices(sIds, pId);
		sE.forEach(serEmp -> userServices
				.computeIfAbsent(serEmp.getEmployee().getId(), key -> new UserServicesMap(serEmp.getEmployee().getId()))
				.addService(serEmp.getService(), serEmp.getService().getDuration()));

		//Get employee work periods for the date
		LocalDate date = Utils.parseDate(d).orElse(LocalDate.now());
		List<Integer> eIds = sE.stream().map(serviceEmployee -> serviceEmployee.getEmployee().getId()).toList();
		ProviderWorkInfo pWI = getProviderWorkInfoAtDay(eIds, pId, date);

		List<BusyPeriod> busyPeriods = providerDAO.getBusyPeriodsAtDay(pId, eIds, date);
		List<BusyPeriod> providerBusyPeriods = busyPeriods.stream().filter(bP -> bP.getProvider() != null).toList();

		//Form time periods
		for (ProviderWorkInfo.Employee e : pWI.getEmployees()) {
			UserServicesMap employee = userServices.get(e.getEmployeeId());
			employee.isWorking = e.isWorking();
			employee.workTime = e.getRealWorkTime();

			//Add breaks
			List<TimePeriod> employeeTimePeriods = new ArrayList<>(e.getRealBreakTime());
			TimePeriod tmpP;

			//Add provider busy periods
			for (BusyPeriod pBP : providerBusyPeriods) {
				tmpP = adjustBusyTimeOneDate(date, pBP);
				employeeTimePeriods.add(new NamedTimePeriod(tmpP.getStart(), tmpP.getEnd(), TimePeriod.CLOSE, NamedTimePeriod.CLOSE_P_BUSY));
			}
			//Add employee busy periods
			List<BusyPeriod> employeeBusyPeriods = busyPeriods.stream().filter(bP -> bP.getEmployee() != null && bP.getEmployee().getId() == e.getEmployeeId()).toList();
			for (BusyPeriod eBP : employeeBusyPeriods) {
				tmpP = adjustBusyTimeOneDate(date, eBP);
				employeeTimePeriods.add(new NamedTimePeriod(tmpP.getStart(), tmpP.getEnd(), TimePeriod.CLOSE, NamedTimePeriod.CLOSE_E_BUSY));
			}
			//Add employee appointments
			List<Appointment> appointments = providerDAO.getAppointmentsAtDay(eIds, date);
			for (Appointment a : appointments) {
				tmpP = adjustTimeToOneDate(date, a.getStart(), a.getEnd());
				employeeTimePeriods.add(new NamedTimePeriod(tmpP.getStart(), tmpP.getEnd(), TimePeriod.CLOSE, NamedTimePeriod.CLOSE_APPOINTMENT));
			}

			//--------CALCULATE FREE PERIODS-------
			List<TimePeriod> freePeriods = calculateFreePeriods(employee.workTime, employeeTimePeriods);

			employeeTimePeriods.addAll(freePeriods);
			employeeTimePeriods.sort(Comparator.comparing(TimePeriod::getStart));
			employee.timePeriods = employeeTimePeriods;

		}

		return userServices;
	}

	private static List<TimePeriod> calculateFreePeriods(List<TimePeriod> workPeriods, List<TimePeriod> busyPeriods) {

		List<TimePeriod> freePeriods = new ArrayList<>();
		List<TimeDot> timeDots = new ArrayList<>();

		workPeriods.forEach(tP -> {
			timeDots.add(new TimeDot(tP.getStart(), tP, true));
			timeDots.add(new TimeDot(tP.getEnd(), tP, false));
		});
		busyPeriods.forEach(eTP -> {
			timeDots.add(new TimeDot(eTP.getStart(), eTP, true));
			timeDots.add(new TimeDot(eTP.getEnd(), eTP, false));
		});
		timeDots.sort(Comparator.comparing(TimeDot::getTime));

		//Calculate free periods
		int lockCounter = 0;
		LocalTime startOfFree = null;
		LocalTime endOfFree = null;

		System.out.println("-------------------");
		for (TimeDot dot : timeDots) {
			System.out.println("TIME DOT - " + dot.getTime() + " " + (dot.isStart() ? " START " : " END ") + (dot.getTimePeriod().getType()));
			if (dot.getTimePeriod().isOpen()) {
				if (dot.isStart()) {
					if (lockCounter > 0)
						lockCounter -= 1;
					if (lockCounter == 0) {
						startOfFree = dot.getTime();
					}
				} else {
					if (lockCounter == 0)
						endOfFree = dot.getTime();
					lockCounter += 1;
				}
			} else {
				if (dot.isStart()) {
					if (lockCounter == 0 && startOfFree != null)
						endOfFree = dot.getTime();
					lockCounter += 1;
				} else {
					lockCounter -= 1;
					if (lockCounter == 0)
						startOfFree = dot.getTime();
				}
			}

			if (startOfFree != null && endOfFree != null) {
				System.out.println("FREE TIME " + startOfFree + " " + endOfFree);
				freePeriods.add(new NamedTimePeriod(startOfFree, endOfFree, TimePeriod.OPEN, NamedTimePeriod.OPEN_FREE_TIME));
				startOfFree = null;
				endOfFree = null;
			}
		}

		return freePeriods;
	}

	private static TimePeriod adjustBusyTimeOneDate(LocalDate atDate, BusyPeriod busyPeriod) {

		if (busyPeriod.getRepeattype() == null) {
			return adjustTimeToOneDate(atDate, busyPeriod.getStart(), busyPeriod.getEnd());
		} else {
			LocalDateTime borderFrom = atDate.atTime(LocalTime.MIN);
			LocalDateTime borderTo = atDate.atTime(LocalTime.MAX);
			LocalDateTime realStart = convertToRealDT(borderFrom.toLocalDate(), busyPeriod.getRepeattype().getName(), busyPeriod.getStart());
			LocalDateTime realEnd = convertToRealDT(borderTo.toLocalDate(), busyPeriod.getRepeattype().getName(), busyPeriod.getEnd());
			LocalTime from = realStart.isBefore(borderFrom) ? borderFrom.toLocalTime() : realStart.toLocalTime();
			LocalTime to = realEnd.isAfter(borderTo) ? borderTo.toLocalTime() : realEnd.toLocalTime();
			return new TimePeriod(from, to);
		}
	}

	private static TimePeriod adjustTimeToOneDate(LocalDate atDate, LocalDateTime dtFrom, LocalDateTime dtTo) {
		LocalTime from = dtFrom.isBefore(atDate.atTime(LocalTime.MIN)) ? LocalTime.MIN : dtFrom.toLocalTime();
		LocalTime to = dtTo.isAfter(atDate.atTime(LocalTime.MAX)) ? LocalTime.MAX : dtTo.toLocalTime();
		return new TimePeriod(from, to);
	}

	private static LocalDateTime convertToRealDT(LocalDate atDate, String repeatType, LocalDateTime repeatDateTime) {
		switch (repeatType) {
			case Utils.EVERY_WEEK -> {
				return atDate.minusDays(atDate.getDayOfWeek().getValue() - repeatDateTime.getDayOfWeek().getValue()).atTime(repeatDateTime.toLocalTime());
			}
			case Utils.EVERY_MONT -> {
				return atDate.minusDays(atDate.getDayOfMonth() - repeatDateTime.getDayOfMonth()).atTime(repeatDateTime.toLocalTime());
			}
			case Utils.EVERY_YEAR -> {
				return repeatDateTime.withYear(atDate.getYear());
			}
			//Also cover EVERY_DAY type
			default -> {
				return atDate.atTime(repeatDateTime.toLocalTime());
			}
		}
	}

	private ProviderWorkInfo getProviderWorkInfoAtDay(List<Integer> eIds, Integer pId, LocalDate date) {

		int day = date.getDayOfWeek().getValue();
		List<WorkPeriod> workPeriod = providerDAO.getWorkPeriodsAtDay(eIds, pId, date);
		ProviderWorkInfo pWI = new ProviderWorkInfo(pId, date);

		if (workPeriod != null && !workPeriod.isEmpty()) {
			workPeriod.forEach(wP -> {

				boolean isOpen = wP.getPeriodtype().getOpen() == 1;
				LocalTime start = wP.getStartDay() < day ? LocalTime.MIN : wP.getStartTime();
				LocalTime end = wP.getEndDay() > day ? LocalTime.MAX : wP.getEndTime();
				TimePeriod timePeriod = new TimePeriod(start, end);

				if (wP.getProvider() != null) {
					if (isOpen) {
						pWI.getWorkPeriods().add(timePeriod);
					} else {
						pWI.getBreakPeriods().add(timePeriod);
					}
					pWI.setName(wP.getProvider().getName());
				} else if (wP.getEmployee() != null) {
					int eId = wP.getEmployee().getId();
					ProviderWorkInfo.Employee eInfo = pWI.getEmployees().stream()
							.filter(e -> e.getEmployeeId() == eId)
							.findAny()
							.orElseGet(() -> {
								ProviderWorkInfo.Employee e = new ProviderWorkInfo.Employee(eId, wP.getEmployee().getUser().getEmail(), pWI);
								pWI.getEmployees().add(e);
								return e;
							});
					if (isOpen) {
						eInfo.getWorkPeriods().add(timePeriod);
					} else {
						eInfo.getBreakPeriods().add(timePeriod);
					}
				}
			});
		}

		if (!pWI.getWorkPeriods().isEmpty())
			pWI.setWorking(true);

		pWI.getWorkPeriods().sort(Comparator.comparing(TimePeriod::getStart));
		pWI.getBreakPeriods().sort(Comparator.comparing(TimePeriod::getStart));

		pWI.getEmployees().forEach(e -> {
			e.getWorkPeriods().sort(Comparator.comparing(TimePeriod::getStart));
			e.getBreakPeriods().sort(Comparator.comparing(TimePeriod::getStart));
			if (!e.getWorkPeriods().isEmpty())
				e.setWorking(true);
		});

		return pWI;
	}
}
