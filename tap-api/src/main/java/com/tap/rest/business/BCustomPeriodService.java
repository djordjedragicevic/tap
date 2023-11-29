package com.tap.rest.business;

import com.tap.appointments.Utils;
import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.db.entity.*;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.common.CUtilRepository;
import com.tap.security.Public;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Path("/business/custom-periods/{pId}")
@RequestScoped
public class BCustomPeriodService {
	@Inject
	CUtilRepository cUtilRepository;
	@Inject
	BProviderRepository bProviderRepository;
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;


	@POST
	@Path("lock/{eId}")
	@Public
	@Transactional
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response rejectAppointment(
			@NotNull @PathParam("pId") int pId,
			@NotNull @PathParam("eId") int eId,
			BusyPeriod bp
	) {

		PeriodType pT = cUtilRepository.getSingleEntityBy(PeriodType.class, Map.of("active", true, "name", Statics.PT_CLOSE_LOCK_TIME));
		Provider provider = cUtilRepository.getSingleEntityBy(Provider.class, Map.of("id", pId, "active", 1));
		Employee e = cUtilRepository.getSingleActiveEntityById(Employee.class, eId);

		bp.setProvider(provider);
		bp.setPeriodtype(pT);
		bp.setEmployee(e);
		bp.setCreateDate(Util.zonedNow());
		bp.setUser(e.getUser());
		bp.setCreateDate(Util.zonedNow());

		em.persist(bp);

		return Response.ok().build();
	}

	@POST
	@Path("appointment")
	@Public
	@Transactional
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response rejectAppointment(JsonObject params, @NotNull @PathParam("pId") Integer pId) {


		Integer eId = params.getInt("eId");
		String comment = params.containsKey("comment") ? params.getString("comment") : null;
		String user = params.containsKey("user") ? params.getString("user") : null;
		LocalDateTime start = LocalDateTime.parse(params.getString("start"));
		List<Integer> sIds = params.getJsonArray("services").stream().mapToInt(s -> Integer.parseInt(s.toString())).boxed().toList();

		List<Service> services = bProviderRepository.getServicesByIds(pId, sIds);

		Employee employee = cUtilRepository.getSingleEntityBy(Employee.class, Map.of("active", (byte) 1, "id", eId));
		AppointmentStatus status = cUtilRepository.getSingleEntityBy(AppointmentStatus.class, Map.of("name", Statics.A_STATUS_ACCEPTED));

		if (employee == null || services.isEmpty() || status == null)
			throw new TAPException(ErrID.B_APP_1);

		String joinId = sIds.size() > 1 ? Utils.generateJoinId(start, pId, sIds) : null;
		int startOffset = 0;

		for (Service s : services) {
			Appointment a = new Appointment();
			a.setStart(start.plusMinutes(startOffset));
			a.setEnd(a.getStart().plusMinutes(s.getDuration()));
			a.setUserName(user);
			a.setService(s);
			a.setEmployee(employee);
			a.setCreateDate(Util.zonedNow());
			a.setUser2(employee.getUser());
			a.setAppointmentstatus(status);
			a.setJoinId(joinId);
			a.setStatusResponseDate(a.getCreateDate());
			a.setComment(comment);

			em.persist(a);

			startOffset += s.getDuration();
		}

		em.flush();
		return Response.ok().build();
	}
}
