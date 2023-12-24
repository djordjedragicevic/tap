package com.tap.rest.sercice.business;

import com.tap.appointments.ProviderWorkInfo;
import com.tap.common.*;
import com.tap.rest.dtor.AppointmentDtoSimple;
import com.tap.rest.entity.CustomPeriod;
import com.tap.rest.entity.Employee;
import com.tap.rest.entity.WorkInfo;
import com.tap.rest.repository.AppointmentRepository;
import com.tap.rest.repository.ProviderRepository;
import com.tap.security.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonArray;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Path("/business/appointments")
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
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAppointmentsAtDate(
			@NotNull @QueryParam("date") String d,
			@Context SecurityContext sC
	) {

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


}
