package com.tap.rest;

import com.tap.appointments.FreeAppointment;
import com.tap.appointments.ProviderWorkInfo;
import com.tap.appointments.Utils;
import com.tap.auth.Public;
import com.tap.common.*;
import com.tap.db.dao.ProviderDAO;
import com.tap.db.dto.EmployeeDTO;
import com.tap.db.dto.ServiceEmployeesDTO;
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
	private static final int FREE_APP_SHIFT = 15;
	private static final int FREE_APP_CREATING_STEP = 5;
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

		List<Integer> sIds = Arrays.stream(s.split(",")).map(Integer::parseInt).toList();
		Set<Integer> eIds = new HashSet<>();
		LocalDate date = Utils.parseDate(d).orElse(LocalDate.now());

		Map<Integer, ServiceEmployeesDTO> serEmpsMap = providerDAO.getActiveServiceEmployees(sIds, pId);
		serEmpsMap
				.values()
				.forEach(sE -> eIds.addAll(sE.getEmployeeIds()));

		ProviderWorkInfo pWI = getProviderWorkInfoAtDay(pId, eIds, date);


		//------------------------ CALCULATE FREE APPOINTMENTS -------------------------

		Map<Integer, List<TimePeriod>> eFreePeriods = new HashMap<>();
		pWI.getEmployees().forEach(e -> eFreePeriods.computeIfAbsent(e.getEmployeeId(), k -> new ArrayList<>()).addAll(e.getFreePeriods()));

		LocalTime start = Utils.roundUpTo5Min(Utils.getEarliestStartTime(eFreePeriods.values()));
		LocalTime end = Utils.getLatestEndTime(eFreePeriods.values());
		LocalTime currentTime = start;

		List<FreeAppointment> apps = new ArrayList<>();

		while (currentTime.isBefore(end)) {

			tryToCreateFreeAppointment(serEmpsMap, currentTime, eFreePeriods)
					.ifPresent(apps::add);

			currentTime = currentTime.plusMinutes(FREE_APP_CREATING_STEP);

		}

		return Map.of("apps", apps);
	}

	private Optional<FreeAppointment> tryToCreateFreeAppointment(Map<Integer, ServiceEmployeesDTO> serEmpsMap, LocalTime startTime, Map<Integer, List<TimePeriod>> empFPs) {

		Deque<Integer> serIds = new ArrayDeque<>(serEmpsMap.keySet());
		FreeAppointment fApp = new FreeAppointment();
		LocalTime startOS;
		LocalTime endOS;
		boolean found;

		for (Integer serId : serIds) {
			startOS = fApp.getServices().isEmpty() ? startTime : fApp.getServices().get(fApp.getServices().size() - 1).getTime().plusMinutes(fApp.getServices().get(fApp.getServices().size() - 1).getDuration());
			endOS = startOS.plusMinutes(serEmpsMap.get(serId).getDuration());
			found = false;
			for (Integer serEmp : serEmpsMap.get(serId).getEmployeeIds()) {
				for (TimePeriod tmpFP : empFPs.get(serEmp)) {
					if (startOS.isAfter(tmpFP.getStart()) && endOS.isBefore(tmpFP.getEnd())) {
						fApp.getServices().add(
								new FreeAppointment.Service(
										serId,
										serEmpsMap.get(serId).getServiceName(),
										serEmp,
										startOS,
										serEmpsMap.get(serId).getDuration()
								)
						);

						fApp.setDurationSum(fApp.getDurationSum() + serEmpsMap.get(serId).getDuration());

						found = true;
						break;
					} else if (endOS.isAfter(tmpFP.getEnd())) {
						//empFPs.get(serEmp).remove(tmpFP);
					}
				}
				if (found)
					break;
			}

			if (!found)
				break;
		}


		if (fApp.getServices().size() == serIds.size()) {
			fApp.setStartAt(fApp.getServices().get(0).getTime());
			return Optional.of(fApp);
		} else {
			return Optional.empty();
		}

	}

	private static List<NamedTimePeriod> calculateFreePeriods
			(List<TimePeriod> workPeriods, List<NamedTimePeriod> timeline) {

		List<NamedTimePeriod> freePeriods = new ArrayList<>();
		List<TimeDot> timeDots = new ArrayList<>();

		workPeriods.forEach(tP -> {
			timeDots.add(new TimeDot(tP.getStart(), true, true));
			timeDots.add(new TimeDot(tP.getEnd(), false, true));
		});
		timeline.forEach(eTP -> {
			timeDots.add(new TimeDot(eTP.getStart(), true, false));
			timeDots.add(new TimeDot(eTP.getEnd(), false, false));
		});
		timeDots.sort(Comparator.comparing(TimeDot::getTime));

		//Calculate free periods
		int lockCounter = 0;
		LocalTime startOfFree = null;
		LocalTime endOfFree = null;

		System.out.println("-------------------");
		for (TimeDot dot : timeDots) {
			System.out.println("TIME DOT - " + dot.getTime() + " " + (dot.isStart() ? " START " : " END ") + (dot.isOpen() ? " OPEN " : " CLOSE "));
			if (dot.isOpen()) {
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
				freePeriods.add(new NamedTimePeriod(startOfFree, endOfFree, TypedTimePeriod.OPEN, NamedTimePeriod.OPEN_FREE_TIME));
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

	private ProviderWorkInfo getProviderWorkInfoAtDay(Integer pId, Set<Integer> eIds, LocalDate date) {

		ProviderWorkInfo pWI = new ProviderWorkInfo(pId, date);

		int day = date.getDayOfWeek().getValue();
		List<WorkPeriod> workPeriod = providerDAO.getWorkPeriodsAtDay(eIds, pId, date);

		if (workPeriod == null || workPeriod.isEmpty())
			return pWI;


		workPeriod.forEach(wP -> {

			boolean isOpen = wP.getPeriodtype().getOpen() == 1;
			LocalTime start = wP.getStartDay() < day ? LocalTime.MIN : wP.getStartTime();
			LocalTime end = wP.getEndDay() > day ? LocalTime.MAX : wP.getEndTime();

			if (wP.getProvider() != null) {
				if (isOpen)
					pWI.getWorkPeriods().add(new TimePeriod(start, end));
				else
					pWI.getBreakPeriods().add(new TimePeriod(start, end));

				pWI.setName(wP.getProvider().getName());

			} else if (wP.getEmployee() != null) {
				int eId = wP.getEmployee().getId();
				User u = wP.getEmployee().getUser();
				ProviderWorkInfo.Employee eInfo = pWI.getEmployees()
						.stream()
						.filter(e -> e.getEmployeeId() == eId)
						.findAny()
						.orElseGet(() -> {
							ProviderWorkInfo.Employee e = new ProviderWorkInfo.Employee(
									eId,
									u.getEmail(),
									u.getFirstName(),
									u.getLastName()
							);
							pWI.getEmployees().add(e);
							return e;
						});
				if (isOpen)
					eInfo.getWorkPeriods().add(new TimePeriod(start, end));
				else
					eInfo.getBreakPeriods().add(new TimePeriod(start, end));
			}
		});

		if (!pWI.getWorkPeriods().isEmpty())
			pWI.setWorking(true);

		pWI.getWorkPeriods().sort(Comparator.comparing(TimePeriod::getStart));
		pWI.getBreakPeriods().sort(Comparator.comparing(TimePeriod::getStart));

		//----------------Create Employee timeline----------------------------------

		List<Appointment> appointments = providerDAO.getAppointmentsAtDay(eIds, date);
		List<BusyPeriod> busyPeriods = providerDAO.getBusyPeriodsAtDay(pId, eIds, date);

		List<TimePeriod> providerBTP = new ArrayList<>();
		List<BusyPeriod> employeeBP = new ArrayList<>();
		busyPeriods.forEach(bP -> {
			if (bP.getProvider() != null)
				providerBTP.add(adjustBusyTimeOneDate(date, bP));
			else
				employeeBP.add(bP);
		});

		for (ProviderWorkInfo.Employee e : pWI.getEmployees()) {

			int eId = e.getEmployeeId();

			if (!e.getWorkPeriods().isEmpty() || pWI.isWorking())
				e.setWorking(true);

			//Employee work time
			boolean hasOwnWT = !e.getWorkPeriods().isEmpty();
			String wWTName = hasOwnWT ? NamedTimePeriod.OPEN_E_WORK : NamedTimePeriod.OPEN_P_WORK;
			List<NamedTimePeriod> eWorkTime = (hasOwnWT ? e.getWorkPeriods() : pWI.getWorkPeriods()).stream().map(wP -> new NamedTimePeriod(wP.getStart(), wP.getEnd(), TypedTimePeriod.OPEN, wWTName)).toList();

			//Employee break time
			boolean hasOwnBT = !e.getBreakPeriods().isEmpty();
			String wBTName = hasOwnWT ? NamedTimePeriod.CLOSE_E_BREAK : NamedTimePeriod.CLOSE_P_BREAK;
			List<NamedTimePeriod> eBreakTime = (hasOwnBT ? e.getBreakPeriods() : pWI.getBreakPeriods()).stream().map(bP -> new NamedTimePeriod(bP.getStart(), bP.getEnd(), TypedTimePeriod.CLOSE, wBTName)).toList();

			//Calculate work time sum
			long workSum = e.getWorkPeriods().stream().mapToLong(wP -> Duration.between(wP.getStart(), wP.getEnd()).toMinutes()).sum();
			e.setWorkTimeSum((int) workSum);


			//-----------Construct timeline--------------

			List<NamedTimePeriod> timeline = e.getTimeline();

			//Add employee breaks
			timeline.addAll(eBreakTime);

			//Add provider busy periods to employee
			providerBTP
					.forEach(pBP -> eWorkTime
							.stream()
							.filter(wP -> Utils.isTimeOverlap(pBP, wP))
							.forEach(wP -> {
								TimePeriod aTP = Utils.adjustOverlapTime(pBP, wP);
								NamedTimePeriod nTP = new NamedTimePeriod(aTP.getStart(), aTP.getEnd(), TypedTimePeriod.CLOSE, NamedTimePeriod.CLOSE_P_BUSY);
								e.getTimeline().add(nTP);
							})
					);

			//Add employee busy periods
			employeeBP
					.stream()
					.filter(eBP -> eBP.getEmployee().getId() == eId)
					.forEach(eBP -> {
						TimePeriod tP = adjustBusyTimeOneDate(date, eBP);
						NamedTimePeriod nTP = new NamedTimePeriod(tP.getStart(), tP.getEnd(), TypedTimePeriod.CLOSE, NamedTimePeriod.CLOSE_E_BUSY);
						e.getTimeline().add(nTP);
					});

			//Add appointments
			appointments
					.stream()
					.filter(a -> a.getEmployee().getId() == eId)
					.forEach(a -> {
						TimePeriod tP = adjustTimeToOneDate(date, a.getStart(), a.getEnd());
						NamedTimePeriod nTP = new NamedTimePeriod(tP.getStart(), tP.getEnd(), TypedTimePeriod.CLOSE, NamedTimePeriod.CLOSE_APPOINTMENT);
						e.getTimeline().add(nTP);
					});

			timeline.sort(Comparator.comparing(TimePeriod::getStart));


			List<NamedTimePeriod> freePeriods = calculateFreePeriods(e.getWorkPeriods(), timeline);
			freePeriods.sort(Comparator.comparing(TimePeriod::getStart));
			e.setFreePeriods(freePeriods);

			timeline.addAll(freePeriods);
			timeline.sort(Comparator.comparing(TimePeriod::getStart));

			//Calculate free time sum
			long freeSum = freePeriods.stream().mapToLong(fP -> Duration.between(fP.getStart(), fP.getEnd()).toMinutes()).sum();
			e.setFreeTimeSum((int) freeSum);

		}

		return pWI;
	}
}
