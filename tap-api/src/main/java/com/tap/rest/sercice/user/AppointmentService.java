package com.tap.rest.sercice.user;

import com.tap.appointments.FreeAppointment;
import com.tap.appointments.ProviderWorkInfo;
import com.tap.appointments.Utils;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.dto.EmployeeDto;
import com.tap.rest.dtor.AppointmentDtoSimple;
import com.tap.rest.repository.AppointmentRepository;
import com.tap.rest.repository.ProviderRepository;
import com.tap.security.Public;
import com.tap.common.*;
import com.tap.rest.dto.ServiceDto;
import com.tap.rest.entity.*;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Path("/appointment")
@RequestScoped
public class AppointmentService {
	private static final int FREE_APP_CREATING_STEP = 15;
	private ProviderRepository providerRepository;
	private AppointmentRepository appointmentRepository;

	public AppointmentService() {

	}

	@Inject
	public AppointmentService(ProviderRepository providerRepository, AppointmentRepository appointmentRepository) {
		this.providerRepository = providerRepository;
		this.appointmentRepository = appointmentRepository;
	}

	@GET
	@Path("/my-appointments")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public List<Map<String, Object>> getMyAppointments(
			@Context SecurityContext sC,
			@QueryParam("f") @DefaultValue("") String filter
	) {

		int userId = Security.getUserId(sC);
		return appointmentRepository.getUserAppointments(userId, filter.isEmpty() || filter.equals("history"));
	}

	@POST
	@Path("/my-appointments/cancel")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Response cancelAppointment(JsonObject params) {

		List<Long> aIds = params.getJsonArray("appIds")
				.stream()
				.mapToLong(s -> Long.parseLong(s.toString()))
				.boxed()
				.toList();

		boolean success = appointmentRepository.cancelAppointments(aIds);

		return Response.ok(success).build();
	}

	@POST
	@Path("/my-appointments/rebook")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Response rebookAppointment(JsonObject params) {

		List<Long> aIds = params.getJsonArray("appIds")
				.stream()
				.mapToLong(s -> Long.parseLong(s.toString()))
				.boxed()
				.toList();

		boolean success = appointmentRepository.rebookAppointments(aIds);

		return Response.ok(success).build();
	}

	@GET
	@Path("free")
	@Public
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> getFreeAppointments(
			@QueryParam("p") Integer pId,
			@QueryParam("d") String d,
			@QueryParam("s") List<Integer> sIds,
			@QueryParam("emps") List<Integer> sEIds
	) {

		Map<String, Object> resp = new HashMap<>();

		LocalDate date = d != null ? LocalDateTime.parse(d).toLocalDate() : LocalDate.now(Util.zone());

		Map<ServiceDto, List<EmployeeDto>> serEmpsMap = providerRepository.getActiveServiceEmployees(sIds, pId);
		if (serEmpsMap.isEmpty())
			return Collections.emptyMap();

		resp.put("serEmps", serEmpsMap
				.keySet()
				.stream()
				.map(s -> Map.of("ser", s, "emps", serEmpsMap.get(s)))
				.toList()
		);

		List<EmployeeDto> emps = serEmpsMap.values().stream().flatMap(Collection::stream).toList();
		List<Integer> eIds = emps.stream().mapToInt(EmployeeDto::getId).distinct().boxed().toList();
		List<AppointmentDtoSimple> appointments = appointmentRepository.getAppointmentsAtDayWAStatus(eIds, date);
		List<CustomPeriod> customPeriods = appointmentRepository.getCustomPeriodsAtDay(pId, eIds, date);
		List<WorkInfo> workInfo = providerRepository.getWorkInfoAtDay(eIds, pId, date.getDayOfWeek().getValue());

		ProviderWorkInfo pWI = new ProviderWorkInfo(pId, date, emps, appointments, customPeriods, workInfo);
		pWI.generateFreePeriods(true);


		List<FreeAppointment> apps = this.generateFreeAppointments(sIds, sEIds, pWI, serEmpsMap);
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
	@Path("/book")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	@Transactional
	public Response bookAppointment(@Context SecurityContext sC, FreeAppointment app) {

		int userId = Security.getUserId(sC);

		List<Integer> eIds = app.getServices().stream().mapToInt(s -> s.getEmployee().getId()).boxed().toList();
		LocalDateTime from = LocalDateTime.of(app.getDate(), app.getServices().get(0).getTime());
		LocalDateTime to = from.plusMinutes(app.getDurationSum());

		boolean isFree = appointmentRepository.isFreeTime(app.getProviderId(), eIds, from, to);
		if (!isFree)
			throw new TAPException(ErrID.TAP_0);


		AppointmentStatus aS = appointmentRepository.getEntityBy(AppointmentStatus.class, "name", Statics.A_STATUS_WAITING);
		User u = appointmentRepository.getSingleActiveEntityById(User.class, userId);
		app.getServices().sort(Comparator.comparing(FreeAppointment.Service::getTime));

		for (FreeAppointment.Service ser : app.getServices()) {
			Appointment fApp = new Appointment();

			LocalDateTime start = LocalDateTime.of(app.getDate(), ser.getTime());
			LocalDateTime end = start.plusMinutes(ser.getService().getDuration());

			Service s = appointmentRepository.getEntityManager().find(Service.class, ser.getService().getId());
			Employee e = appointmentRepository.getEntityManager().find(Employee.class, ser.getEmployee().getId());
			PeriodType pT = appointmentRepository.getEntityBy(PeriodType.class, "name", Statics.PT_APP_BY_USER);

			fApp.setStart(start);
			fApp.setEnd(end);
			fApp.setPeriodtype(pT);
			fApp.setAppointmentstatus(aS);
			fApp.setEmployee(e);
			fApp.setService(s);
			fApp.setUser(u);
			fApp.setUser2(u);
			fApp.setCreateDate(LocalDateTime.now(Util.zone()));
			if (app.getServices().size() > 1)
				fApp.setJoinId(ser.getJoinId());

			appointmentRepository.getEntityManager().persist(fApp);
		}

		return Response.ok().build();
	}

	private List<FreeAppointment> generateFreeAppointments(List<Integer> sIds, List<Integer> sEIds, ProviderWorkInfo pWI, Map<ServiceDto, List<EmployeeDto>> serEmpsMap) {
		List<FreeAppointment> apps = new ArrayList<>();
		int pId = pWI.getProviderId();
		LocalDate date = pWI.getAtDay();
		Map<Integer, List<TimePeriod>> eFreePeriods = new HashMap<>();
		pWI.getEmployees().forEach(e -> eFreePeriods.computeIfAbsent(e.employeeId, k -> new ArrayList<>()).addAll(e.freePeriods));

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
}
