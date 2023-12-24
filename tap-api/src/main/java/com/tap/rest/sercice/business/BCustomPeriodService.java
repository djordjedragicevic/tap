package com.tap.rest.sercice.business;

import com.tap.appointments.Utils;
import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.rest.entity.*;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.repository.ProviderRepository;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Token;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Path("/business/custom-periods")
@RequestScoped
public class BCustomPeriodService {
	private ProviderRepository providerRepository;

	public BCustomPeriodService() {

	}

	@Inject
	public BCustomPeriodService(ProviderRepository providerRepository) {
		this.providerRepository = providerRepository;
	}

	@POST
	@Path("lock")
	@Transactional
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	public Response rejectAppointment(
			@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer,
			CustomPeriod bp
	) {

		Token token = new Token(bearer);
		int pId = token.getProviderId();
		int eId = token.getEmployeeId();

		PeriodType pT = providerRepository.getSingleEntityBy(PeriodType.class, Map.of("active", true, "name", Statics.PT_C_LOCK_TIME));
		Provider provider = providerRepository.getSingleEntityBy(Provider.class, Map.of("id", pId, "active", 1));
		Employee e = providerRepository.getSingleActiveEntityById(Employee.class, eId);

		if (bp.getStart() == null || bp.getEnd() == null || bp.getEnd().isBefore(bp.getStart()))
			throw new TAPException(ErrID.B_APP_2);

		bp.setProvider(provider);
		bp.setPeriodtype(pT);
		bp.setEmployee(e);
		bp.setCreateDate(Util.zonedNow());
		bp.setUser(e.getUser());
		bp.setCreateDate(Util.zonedNow());

		providerRepository.getEntityManager().persist(bp);

		return Response.ok().build();
	}

	@POST
	@Path("appointment")
	@Transactional
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	public Response createAppointment(JsonObject params, @HeaderParam(HttpHeaders.AUTHORIZATION) String bearer) {

		Token t = new Token(bearer);
		int eId = t.getEmployeeId();
		int pId = t.getProviderId();

		String comment = params.containsKey("comment") ? params.getString("comment") : null;
		String user = params.containsKey("user") ? params.getString("user") : null;
		LocalDateTime start = LocalDateTime.parse(params.getString("start"));
		List<Integer> sIds = params.getJsonArray("services").stream().mapToInt(s -> Integer.parseInt(s.toString())).boxed().toList();

		List<Service> services = providerRepository.getServicesByIds(pId, sIds);

		Employee employee = providerRepository.getSingleEntityBy(Employee.class, Map.of("active", (byte) 1, "id", eId));
		AppointmentStatus status = providerRepository.getSingleEntityBy(AppointmentStatus.class, Map.of("name", Statics.A_STATUS_ACCEPTED));
		PeriodType periodType = providerRepository.getSingleEntityBy(PeriodType.class, Map.of("name", Statics.PT_APP_BY_USER, "active", 1));

		if (employee == null || services.isEmpty() || status == null)
			throw new TAPException(ErrID.B_APP_1);

		String joinId = sIds.size() > 1 ? Utils.generateJoinId(start, pId, sIds) : null;
		int startOffset = 0;

		for (Service s : services) {
			Appointment a = new Appointment();
			a.setStart(start.plusMinutes(startOffset));
			a.setEnd(a.getStart().plusMinutes(s.getDuration()));
			a.setPeriodtype(periodType);
			a.setUserName(user);
			a.setService(s);
			a.setEmployee(employee);
			a.setCreateDate(Util.zonedNow());
			a.setUser2(employee.getUser());
			a.setAppointmentstatus(status);
			a.setJoinId(joinId);
			a.setStatusResponseDate(a.getCreateDate());
			a.setComment(comment);

			providerRepository.getEntityManager().persist(a);

			startOffset += s.getDuration();
		}

		providerRepository.getEntityManager().flush();
		return Response.ok().build();
	}
}
