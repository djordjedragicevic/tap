package com.tap.rest.business;

import com.tap.common.Mail;
import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.db.entity.*;
import com.tap.rest.common.CUtilRepository;
import com.tap.security.Public;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Date;
import java.util.Map;

@Path("business/manual-periods")
@RequestScoped
public class BManualPeriodService {
	@Inject
	BManualPeriodRepository bManualPeriodRepository;
	@Inject
	CUtilRepository cUtilRepository;
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;


	@POST
	@Path("/busy-period/{pId}")
	@Public
	@Transactional
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response rejectAppointment(
			BusyPeriod bp,
			@NotNull @PathParam("pId") int pId
	) {


		PeriodType pT = cUtilRepository.getSingleEntityBy(PeriodType.class,  Map.of("active", true, "name", Statics.PT_CLOSE_LOCK_TIME));
		Provider provider = cUtilRepository.getSingleEntityBy(Provider.class, Map.of("id", pId, "active", 1));
		User u = cUtilRepository.getSingleEntityBy(User.class, Map.of("id", 1));

		bp.setProvider(provider);
		bp.setPeriodtype(pT);
		bp.setUser(u);
		bp.setCreateDate(Util.zonedNow());

		em.persist(bp);

		return Response.ok().build();
	}
}
