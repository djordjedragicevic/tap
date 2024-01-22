package com.tap.rest.sercice.business;

import com.tap.appointments.ProviderWorkInfo;
import com.tap.appointments.Utils;
import com.tap.common.*;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.dto.AppointmentDto;
import com.tap.rest.dto.CustomPeriodDto;
import com.tap.rest.dto.GroupDto;
import com.tap.rest.dto.ServiceDto;
import com.tap.rest.dtor.AppointmentDtoSimple;
import com.tap.rest.entity.*;
import com.tap.rest.repository.AppointmentRepository;
import com.tap.rest.repository.ProviderRepository;
import com.tap.security.*;
import com.tap.security.Role;
import com.tap.security.Token;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Path("/business/appointment")
@RequestScoped
@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
public class BAppointmentsService {
	private AppointmentRepository appointmentRepository;
	private ProviderRepository providerRepository;

	public BAppointmentsService() {
	}

	@Inject
	public BAppointmentsService(AppointmentRepository appointmentRepository, ProviderRepository providerRepository) {
		this.appointmentRepository = appointmentRepository;
		this.providerRepository = providerRepository;
	}

	@GET
	@Path("/calendar")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	public Response getAppointmentsCalendar(@Context SecurityContext sC, @NotNull @QueryParam("date") String d) {

		LocalDateTime from = LocalDateTime.parse(d);
		LocalDate date = from.toLocalDate();
		int userId = Security.getUserId(sC);
		boolean isOwner = sC.isUserInRole(Role.PROVIDER_OWNER.getName());

		Employee e = providerRepository.getSingleEntityBy(Employee.class, Map.of(
				"user.id", userId,
				"active", 1
		));

		int pId = e.getProvider().getId();
		List<Employee> emps = isOwner ? providerRepository.getProviderEmployees(pId) : List.of(e);
		List<Integer> eIds = emps.stream().mapToInt(Employee::getId).boxed().toList();
		List<AppointmentDtoSimple> apps = appointmentRepository.getWAAppointmentsAtDay(eIds, date);
		List<CustomPeriod> bps = appointmentRepository.getCustomPeriodsAtDay(pId, eIds, date);

		List<WorkInfo> wps = appointmentRepository.getBreaksPeriodsAtDay(pId, eIds, date.getDayOfWeek().getValue());

		ProviderWorkInfo pWI = new ProviderWorkInfo(pId, date, emps, apps, bps, wps);

		return Response.ok(pWI).build();
	}

	@GET
	@Path("/waiting")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getWaitingAppointments(@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer) {
		int pId = new Token(bearer).getProviderId();
		List<AppointmentDtoSimple> apps = appointmentRepository.getWaitingAppointments(pId, Util.zonedNow());
		return Response.ok(apps).build();
	}

	@POST
	@Path("/accept/{appId}/{sId}")
	@Transactional
	public Response acceptAppointment(
			@NotNull @PathParam("appId") Long appId,
			@NotNull @PathParam("sId") Integer sId
	) {

		appointmentRepository.acceptAppointment(appId, sId, Util.zonedNow());
		return Response.ok().build();
	}

	@POST
	@Path("/accept/multi")
	@Transactional
	@Consumes(MediaType.APPLICATION_JSON)
	public Response acceptAppointmentMulti(JsonArray appIds) {
		List<Long> apps = appIds.stream().mapToLong(v -> Long.parseLong(v.toString())).boxed().toList();
		appointmentRepository.acceptAppointmentMulti(apps);
		return Response.ok().build();
	}

	@POST
	@Path("/reject/{appId}/{sId}")
	@Transactional
	public Response rejectAppointment(
			@NotNull @PathParam("appId") Long appId,
			@NotNull @PathParam("sId") Integer sId
	) {

		appointmentRepository.rejectAppointment(appId, sId, Util.zonedNow());
		return Response.ok().build();
	}

	@GET
	@Path("/{id}/multi")
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAppointmentMulti(@Context SecurityContext sC, @PathParam("id") Long appId) {

		List<Appointment> apps;
		List<AppointmentDto> resp = new ArrayList<>();
		Appointment app = appointmentRepository.getEntityManager().find(Appointment.class, appId);

		if (app.getJoinId() != null && !app.getJoinId().isEmpty())
			apps = appointmentRepository.getEntityListBy(Appointment.class, "joinId", app.getJoinId());
		else
			apps = List.of(app);

		for (Appointment a : apps) {

			Service s = a.getService();
			Group g = s.getGroup();
			AppointmentDto appDto = new AppointmentDto()
					.setId(a.getId())
					.setStart(a.getStart())
					.setEnd(a.getEnd())
					.setComment(a.getComment());

			ServiceDto sDto = new ServiceDto()
					.setId(s.getId())
					.setName(s.getName())
					.setDuration(s.getDuration())
					.setPrice(s.getPrice());
			if (g != null) {
				sDto.setGroup(new GroupDto()
						.setId(g.getId())
						.setName(g.getName())
				);
			}
			appDto.setService(sDto);
		}

		return Response.ok(resp).build();
	}

	@GET
	@Path("/{id}")
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAppointment(@Context SecurityContext sC, @PathParam("id") Long appId) {

		Appointment app = appointmentRepository.getEntityManager().find(Appointment.class, appId);

		Validate.checkProvEmpAccess(app.getEmployee().getId(), sC);

		ServiceDto sDto = new ServiceDto()
				.setId(app.getService().getId())
				.setName(app.getService().getName())
				.setPrice(app.getService().getPrice())
				.setDuration(app.getService().getDuration());

		Group g = app.getService().getGroup();
		if (g != null) {
			sDto.setGroup(new GroupDto()
					.setId(g.getId())
					.setName(g.getName())
			);
		}

		AppointmentDto appDto = new AppointmentDto()
				.setId(app.getId())
				.setStart(app.getStart())
				.setEnd(app.getEnd())
				.setComment(app.getComment())
				.setService(sDto);

		return Response.ok(appDto).build();
	}

	@POST
	@Path("/add")
	@Transactional
	public Response addAppointment(@Context SecurityContext sC, JsonObject params) {


		int eId = Security.getEmployeeId(sC);
		int pId = Security.getProviderId(sC);

		String comment = params.containsKey("comment") ? params.getString("comment") : null;
		LocalDateTime start = LocalDateTime.parse(params.getString("start"));
		List<Integer> sIds = params.getJsonArray("services").stream().mapToInt(s -> Integer.parseInt(s.toString())).boxed().toList();

		List<Service> services = providerRepository.getServicesByIds(pId, sIds);

		Employee employee = providerRepository.getSingleActiveEntityById(Employee.class, eId);
		AppointmentStatus status = providerRepository.getSingleEntityBy(AppointmentStatus.class, Map.of("name", Statics.A_STATUS_ACCEPTED));
		PeriodType periodType = providerRepository.getSingleEntityBy(PeriodType.class, Map.of("name", Statics.PT_APP_BY_PROVIDER));

		if (employee == null || services.isEmpty() || status == null)
			throw new TAPException(ErrID.B_APP_1);

		String joinId = sIds.size() > 1 ? Utils.generateJoinId(start, pId, sIds) : null;
		int startOffset = 0;

		for (Service s : services) {
			Appointment a = new Appointment();
			a.setStart(start.plusMinutes(startOffset));
			a.setEnd(a.getStart().plusMinutes(s.getDuration()));
			a.setPeriodtype(periodType);
			a.setService(s);
			a.setEmployee(employee);
			a.setCreatedAt(Util.zonedNow());
			a.setUser2(employee.getUser());
			a.setAppointmentstatus(status);
			a.setJoinId(joinId);
			a.setComment(comment);

			providerRepository.getEntityManager().persist(a);

			startOffset += s.getDuration();
		}

		providerRepository.getEntityManager().flush();
		return Response.ok().build();
	}

	@DELETE
	@Path("/delete/{id}")
	@Secured({Role.EMPLOYEE})
	@Transactional
	public Response deleteAppointment(@Context SecurityContext sC, @PathParam("id") Long appId) {

		Appointment app = appointmentRepository.getEntityManager().find(Appointment.class, appId);

		Validate.checkIsEmpOwnerOfPeriod(app.getEmployee().getId(), sC);

		appointmentRepository.getEntityManager().remove(app);

		return Response.ok().build();
	}

	@POST
	@Path("/edit")
	@Secured({Role.EMPLOYEE})
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public Response editAppointment(@Context SecurityContext sC, AppointmentDto appDto) {

		Appointment app = appointmentRepository.getEntityManager().find(Appointment.class, appDto.getId());

		Validate.checkIsEmpOwnerOfPeriod(app.getEmployee().getId(), sC);

		app.setComment(appDto.getComment());
		app.setStart(appDto.getStart());
		app.setEnd(appDto.getStart().plusMinutes(app.getService().getDuration()));


		return Response.ok().build();
	}

}
