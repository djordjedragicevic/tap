package com.tap.rest;

import com.tap.appointments.FreeAppointment;
import com.tap.appointments.ProviderWorkInfo;
import com.tap.appointments.Utils;
import com.tap.security.Public;
import com.tap.common.*;
import com.tap.db.dto.EmployeeDto;
import com.tap.db.dto.ServiceDto;
import com.tap.db.entity.*;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Path("appointments")
@RequestScoped
public class AppointmentService {
	public static String A_STATUS_WAITING = "WAITING";
	public static String A_STATUS_ACCEPTED = "ACCEPTED";
	public static String A_STATUS_REJECTED = "REJECTED";
	public static String A_STATUS_CANCELED = "CANCELED";
	private static final int FREE_APP_CREATING_STEP = 15;
	@Inject
	private ProviderRepository providerRepository;

	@Inject
	private AppointmentRepository appointmentRep;

	@GET
	@Path("my-appointments")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Map<String, Object> getMyAppointments(
			@Context SecurityContext sC,
			@QueryParam("f") @DefaultValue("") String filter
	) {
		Map<String, Object> resp = new HashMap<>();
		int userId = Security.getUserId(sC);

		if (filter.isEmpty() || filter.equals("coming"))
			resp.put("comingApps", appointmentRep.getUserAppointments(userId, false));

		if (filter.isEmpty() || filter.equals("history"))
			resp.put("historyApps", appointmentRep.getUserAppointments(userId, true));

		return resp;
	}

	@POST
	@Path("my-appointments/cancel")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Response cancelAppointment(JsonObject params) {

		List<Long> aIds = params.getJsonArray("appIds")
				.stream()
				.mapToLong(s -> Long.parseLong(s.toString()))
				.boxed()
				.toList();

		boolean success = appointmentRep.cancelAppointments(aIds);

		return Response.ok(success).build();
	}

	@POST
	@Path("my-appointments/rebook")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Response rebookAppointment(JsonObject params) {

		List<Long> aIds = params.getJsonArray("appIds")
				.stream()
				.mapToLong(s -> Long.parseLong(s.toString()))
				.boxed()
				.toList();

		boolean success = appointmentRep.rebookAppointments(aIds);

		return Response.ok(success).build();
	}

	@GET
	@Path("free")
	@Public
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> getFreeAppointments(
			@QueryParam("p") Integer pId,
			@QueryParam("d") Date d,
			@QueryParam("s") List<Integer> sIds,
			@QueryParam("emps") List<Integer> sEIds
	) {

		Map<String, Object> resp = new HashMap<>();

		LocalDate date = d != null ? Util.zonedDT(d).toLocalDate() : LocalDate.now(Util.zone());

		Map<ServiceDto, List<EmployeeDto>> serEmpsMap = providerRepository.getActiveServiceEmployees(sIds, pId);
		if (serEmpsMap.isEmpty())
			return Collections.emptyMap();

		resp.put("serEmps", serEmpsMap
				.keySet()
				.stream()
				.map(s -> Map.of("ser", s, "emps", serEmpsMap.get(s)))
				.toList()
		);
		List<Integer> eIds = serEmpsMap.values().stream().flatMap(Collection::stream).mapToInt(EmployeeDto::getId).distinct().boxed().toList();


		ProviderWorkInfo pWI = this.getProviderWorkInfoAtDay(pId, eIds, date);
		//resp.put("pwi", pWI);


		List<FreeAppointment> apps = this.getFreeAppointments(sIds, sEIds, pWI, serEmpsMap);
		resp.put("apps", apps);

		Map<String, Object> provider = new HashMap<>();
		provider.put("address", pWI.getProviderAddress());
		provider.put("city", pWI.getProviderCity());
		provider.put("name", pWI.getProviderName());
		provider.put("type", pWI.getProviderType());

		resp.put("provider", provider);

		return resp;
	}

	@POST
	@Path("book")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Response bookAppointment(@Context SecurityContext sC, FreeAppointment app) {

		int userId = Security.getUserId(sC);

		boolean success = appointmentRep.saveAppointment(app, userId);

		return Response.ok(success).build();
	}

	private List<FreeAppointment> getFreeAppointments(List<Integer> sIds, List<Integer> sEIds, ProviderWorkInfo pWI, Map<ServiceDto, List<EmployeeDto>> serEmpsMap) {
		List<FreeAppointment> apps = new ArrayList<>();
		int pId = pWI.getProviderId();
		LocalDate date = pWI.getAtDay();
		Map<Integer, List<TimePeriod>> eFreePeriods = new HashMap<>();
		pWI.getEmployees().forEach(e -> eFreePeriods.computeIfAbsent(e.getEmployeeId(), k -> new ArrayList<>()).addAll(e.getFreePeriods()));

		LocalTime end = Utils.getLatestEndTime(eFreePeriods.values());
		LocalTime currentTime = Utils.roundUpToXMin(LocalDate.now(Util.zone()).equals(date) ? LocalTime.now(Util.zone()) : Utils.getEarliestStartTime(eFreePeriods.values()), FREE_APP_CREATING_STEP);
		Map<Integer, Integer> empFilterMap = new HashMap<>();
		for (int i = 0, s = sIds.size(); i < s; i++)
			empFilterMap.put(sIds.get(i), sEIds.get(i));

		while (currentTime.isBefore(end)) {
			Optional<FreeAppointment> app = tryToCreateFreeAppointment(empFilterMap, serEmpsMap, currentTime, eFreePeriods);
			if (app.isPresent()) {
				String id = ZonedDateTime.of(date, currentTime, Util.zone()).toEpochSecond() + "S" + sIds.stream().map(String::valueOf).collect(Collectors.joining("_")) + "P" + pId;
				app.get().finalize(id, pId, date);
				apps.add(app.get());
			}

			currentTime = currentTime.plusMinutes(FREE_APP_CREATING_STEP);
		}

		return apps;
	}


	private Optional<FreeAppointment> tryToCreateFreeAppointment(Map<Integer, Integer> empFilterMap, Map<ServiceDto, List<EmployeeDto>> serEmpsMap, LocalTime startTime, Map<Integer, List<TimePeriod>> empFPs) {

		FreeAppointment fApp = new FreeAppointment();
		LocalTime startOS;
		LocalTime endOS;
		boolean found;
		int filerEId;
		ServiceDto ser;
		for (Map.Entry<ServiceDto, List<EmployeeDto>> en : serEmpsMap.entrySet()) {

			ser = en.getKey();
			filerEId = empFilterMap.get(ser.getId());
			startOS = fApp.getServices().isEmpty() ? startTime : fApp.getServices().get(fApp.getServices().size() - 1).getTime().plusMinutes(fApp.getServices().get(fApp.getServices().size() - 1).getService().getDuration());
			endOS = startOS.plusMinutes(ser.getDuration());
			found = false;


			for (EmployeeDto emp : en.getValue()) {
				if (filerEId == -1 || emp.getId() == filerEId) {
					for (TimePeriod tmpFP : empFPs.get(emp.getId())) {
						if (startOS.isAfter(tmpFP.getStart()) && endOS.isBefore(tmpFP.getEnd())) {
							fApp.getServices().add(
									new FreeAppointment.Service(
											startOS,
											ser,
											emp
									)
							);

							fApp.setDurationSum(fApp.getDurationSum() + ser.getDuration());

							found = true;
							break;

							//TODO: Implement clearing mechanism
						} else if (endOS.isAfter(tmpFP.getEnd())) {

						}
					}
					if (found)
						break;
				}
			}

			if (!found)
				break;
		}


		if (fApp.getServices().size() == serEmpsMap.size()) {
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

	private ProviderWorkInfo getProviderWorkInfoAtDay(Integer pId, List<Integer> eIds, LocalDate date) {

		ProviderWorkInfo pWI = new ProviderWorkInfo(pId, date);

		int day = date.getDayOfWeek().getValue();
		List<WorkPeriod> workPeriod = providerRepository.getWorkPeriodsAtDay(eIds, pId, day);

		if (workPeriod == null || workPeriod.isEmpty())
			return pWI;


		workPeriod.forEach(wP -> {

			boolean isOpen = wP.getPeriodtype().getOpen() == 1;
			LocalTime start = wP.getStartTime();
			LocalTime end = wP.getEndTime();

			if (wP.getProvider() != null) {
				if (isOpen)
					pWI.getWorkPeriods().add(new TimePeriod(start, end));
				else
					pWI.getBreakPeriods().add(new TimePeriod(start, end));

				pWI.setProviderName(wP.getProvider().getName());
				pWI.setProviderAddress(wP.getProvider().getAddress().getAddress1());
				pWI.setProviderCity(wP.getProvider().getAddress().getCity().getName());
				pWI.setProviderType(wP.getProvider().getProvidertype().getName());

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

		List<Appointment> appointments = appointmentRep.getAppointmentsAtDayWAStatus(eIds, date);
		List<BusyPeriod> busyPeriods = appointmentRep.getBusyPeriodsAtDay(pId, eIds, date);

		List<TimePeriod> providerBTP = new ArrayList<>();
		List<BusyPeriod> employeeBP = new ArrayList<>();
		busyPeriods.forEach(bP -> {
			if (bP.getProvider() != null)
				providerBTP.add(bP.getRepeattype() != null ?
						Utils.adjustRepeatablePeriodToOnaDate(date, bP.getStart(), bP.getEnd(), bP.getRepeattype().getName())
						:
						Utils.adjustPeriodToOnaDate(date, bP.getStart(), bP.getEnd()));
			else
				employeeBP.add(bP);
		});

		for (ProviderWorkInfo.Employee e : pWI.getEmployees()) {

			int eId = e.getEmployeeId();

			if (!e.getWorkPeriods().isEmpty() || Boolean.TRUE.equals(pWI.getWorking()))
				e.setWorking(true);

			//Employee work time
			boolean hasOwnWT = !e.getWorkPeriods().isEmpty();
			String wWTName = hasOwnWT ? NamedTimePeriod.OPEN_EMPLOYEE_WORK : NamedTimePeriod.OPEN_PROVIDER_WORK;
			List<NamedTimePeriod> eWorkTime = (hasOwnWT ? e.getWorkPeriods() : pWI.getWorkPeriods()).stream().map(wP -> new NamedTimePeriod(wP.getStart(), wP.getEnd(), TypedTimePeriod.OPEN, wWTName)).toList();

			//Employee break time
			boolean hasOwnBT = !e.getBreakPeriods().isEmpty();
			String wBTName = hasOwnWT ? NamedTimePeriod.CLOSE_EMPLOYEE_BREAK : NamedTimePeriod.CLOSE_PROVIDER_BREAK;
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
								NamedTimePeriod nTP = new NamedTimePeriod(aTP.getStart(), aTP.getEnd(), TypedTimePeriod.CLOSE, NamedTimePeriod.CLOSE_PROVIDER_BUSY);
								e.getTimeline().add(nTP);
							})
					);

			//Add employee busy periods
			employeeBP
					.stream()
					.filter(eBP -> eBP.getEmployee().getId() == eId)
					.forEach(eBP -> {
						TimePeriod tP = eBP.getRepeattype() != null ?
								Utils.adjustRepeatablePeriodToOnaDate(date, eBP.getStart(), eBP.getEnd(), eBP.getRepeattype().getName())
								:
								Utils.adjustPeriodToOnaDate(date, eBP.getStart(), eBP.getEnd());
						NamedTimePeriod nTP = new NamedTimePeriod(tP.getStart(), tP.getEnd(), TypedTimePeriod.CLOSE, NamedTimePeriod.CLOSE_EMPLOYEE_BUSY);
						e.getTimeline().add(nTP);
					});

			//Add appointments
			appointments
					.stream()
					.filter(a -> a.getEmployee().getId() == eId)
					.forEach(a -> {
						TimePeriod tP = Utils.adjustPeriodToOnaDate(date, a.getStart(), a.getEnd());
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
