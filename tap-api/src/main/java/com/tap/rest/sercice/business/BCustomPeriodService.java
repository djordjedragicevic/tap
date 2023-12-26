package com.tap.rest.sercice.business;

import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.rest.dto.CustomPeriodDto;
import com.tap.rest.entity.*;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.repository.CustomPeriodRepository;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.Map;

@Path("/business/custom-period")
@RequestScoped
public class BCustomPeriodService {
	private CustomPeriodRepository customPeriodRepository;

	public BCustomPeriodService() {

	}

	@Inject
	public BCustomPeriodService(CustomPeriodRepository customPeriodRepository) {
		this.customPeriodRepository = customPeriodRepository;
	}

	@GET
	@Path("/{id}")
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	@Produces(MediaType.APPLICATION_JSON)
	public Response getCustomPeriod(@Context SecurityContext sC, @PathParam("id") Long periodId) {

		CustomPeriod cP = customPeriodRepository.getEntityManager().find(CustomPeriod.class, periodId);
		this.checkProvEmpAccess(cP, sC);

		CustomPeriodDto cPDto = new CustomPeriodDto()
				.setId(cP.getId())
				.setStart(cP.getStart())
				.setEnd(cP.getEnd())
				.setComment(cP.getComment());

		return Response.ok(cPDto).build();
	}

	@DELETE
	@Path("/{id}")
	@Secured({Role.EMPLOYEE})
	@Produces(MediaType.APPLICATION_JSON)
	@Transactional
	public Response deleteCustomPeriod(@Context SecurityContext sC, @PathParam("id") Long periodId) {

		CustomPeriod cP = customPeriodRepository.getEntityManager().find(CustomPeriod.class, periodId);
		this.checkIsEmpOwnerOfPeriod(cP, sC);

		customPeriodRepository.getEntityManager().remove(cP);

		return Response.ok().build();
	}

	@POST
	@Path("/add")
	@Secured({Role.EMPLOYEE})
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public Response addCustomPeriod(@Context SecurityContext sc, CustomPeriodDto cPDto) {

		this.validateTimePeriod(cPDto.getStart(), cPDto.getEnd());

		int pId = Security.getProviderId(sc);
		int uId = Security.getUserId(sc);
		int eId = Security.getEmployeeId(sc);

		User u = customPeriodRepository.getSingleActiveEntityById(User.class, uId);
		Employee e = customPeriodRepository.getSingleActiveEntityById(Employee.class, eId);
		Provider p = customPeriodRepository.getSingleActiveEntityById(Provider.class, pId);
		PeriodType pT = customPeriodRepository.getSingleEntityBy(PeriodType.class, Map.of("name", Statics.PT_C_LOCK_TIME));

		CustomPeriod cP = new CustomPeriod();

		cP.setProvider(p);
		cP.setUser(u);
		cP.setEmployee(e);
		cP.setPeriodtype(pT);
		cP.setComment(cPDto.getComment());
		cP.setStart(cPDto.getStart());
		cP.setEnd(cPDto.getEnd());
		cP.setCreateDate(Util.zonedNow());

		customPeriodRepository.getEntityManager().persist(cP);

		return Response.ok().build();
	}

	@POST
	@Path("/edit")
	@Secured({Role.EMPLOYEE})
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	public Response editCustomPeriod(@Context SecurityContext sC, CustomPeriodDto cPDto) {

		this.validateTimePeriod(cPDto.getStart(), cPDto.getEnd());

		CustomPeriod cP = customPeriodRepository.getEntityManager().find(CustomPeriod.class, cPDto.getId());
		this.checkIsEmpOwnerOfPeriod(cP, sC);
		cP.setComment(cPDto.getComment());
		if (cPDto.getStart() != null)
			cP.setStart(cPDto.getStart());
		if (cPDto.getEnd() != null)
			cP.setEnd(cPDto.getEnd());

		return Response.ok().build();
	}


	private void checkIsEmpOwnerOfPeriod(CustomPeriod cP, SecurityContext sC) {
		if (cP.getEmployee().getId() != Security.getEmployeeId(sC))
			throw new TAPException(ErrID.TAP_1);
	}

	private void checkProvEmpAccess(CustomPeriod cP, SecurityContext sC) {
		boolean isOwner = sC.isUserInRole(Role.PROVIDER_OWNER.getName());

		if (isOwner && cP.getProvider().getId() != Security.getProviderId(sC))
			throw new TAPException(ErrID.TAP_1);
		if (!isOwner && cP.getEmployee().getId() != Security.getEmployeeId(sC))
			throw new TAPException(ErrID.TAP_1);
	}

	private void validateTimePeriod(LocalDateTime start, LocalDateTime end) {
		int dur = ConfigProvider.getConfig().getValue("tap.business.minimum.timeperiod.duration", Integer.class);
		if (ChronoUnit.MINUTES.between(start, end) < dur)
			throw new TAPException(ErrID.B_TP, null, Map.of("duration", String.valueOf(dur)));
	}
//	@POST
//	@Path("/add")
//	@Transactional
//	@Secured({Role.EMPLOYEE})
//	public Response rejectAppointment(
//			@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer,
//			CustomPeriod bp
//	) {
//
//		Token token = new Token(bearer);
//		int pId = token.getProviderId();
//		int eId = token.getEmployeeId();
//
//		PeriodType pT = customPeriodRepository.getSingleEntityBy(PeriodType.class, Map.of("active", true, "name", Statics.PT_C_LOCK_TIME));
//		Provider provider = customPeriodRepository.getSingleEntityBy(Provider.class, Map.of("id", pId, "active", 1));
//		Employee e = customPeriodRepository.getSingleActiveEntityById(Employee.class, eId);
//
//		if (bp.getStart() == null || bp.getEnd() == null || bp.getEnd().isBefore(bp.getStart()))
//			throw new TAPException(ErrID.B_APP_2);
//
//		bp.setProvider(provider);
//		bp.setPeriodtype(pT);
//		bp.setEmployee(e);
//		bp.setCreateDate(Util.zonedNow());
//		bp.setUser(e.getUser());
//		bp.setCreateDate(Util.zonedNow());
//
//		customPeriodRepository.getEntityManager().persist(bp);
//
//		return Response.ok().build();
//	}
//

//	@POST
//	@Path("appointment")
//	@Transactional
//	@Consumes(MediaType.APPLICATION_JSON)
//	@Produces(MediaType.APPLICATION_JSON)
//	@Secured({Role.EMPLOYEE})
//	public Response createAppointment(JsonObject params, @HeaderParam(HttpHeaders.AUTHORIZATION) String bearer) {
//
//		Token t = new Token(bearer);
//		int eId = t.getEmployeeId();
//		int pId = t.getProviderId();
//
//		String comment = params.containsKey("comment") ? params.getString("comment") : null;
//		String user = params.containsKey("user") ? params.getString("user") : null;
//		LocalDateTime start = LocalDateTime.parse(params.getString("start"));
//		List<Integer> sIds = params.getJsonArray("services").stream().mapToInt(s -> Integer.parseInt(s.toString())).boxed().toList();
//
//		List<Service> services = customPeriodRepository.getServicesByIds(pId, sIds);
//
//		Employee employee = customPeriodRepository.getSingleEntityBy(Employee.class, Map.of("active", (byte) 1, "id", eId));
//		AppointmentStatus status = customPeriodRepository.getSingleEntityBy(AppointmentStatus.class, Map.of("name", Statics.A_STATUS_ACCEPTED));
//		PeriodType periodType = customPeriodRepository.getSingleEntityBy(PeriodType.class, Map.of("name", Statics.PT_APP_BY_USER));
//
//		if (employee == null || services.isEmpty() || status == null)
//			throw new TAPException(ErrID.B_APP_1);
//
//		String joinId = sIds.size() > 1 ? Utils.generateJoinId(start, pId, sIds) : null;
//		int startOffset = 0;
//
//		for (Service s : services) {
//			Appointment a = new Appointment();
//			a.setStart(start.plusMinutes(startOffset));
//			a.setEnd(a.getStart().plusMinutes(s.getDuration()));
//			a.setPeriodtype(periodType);
//			a.setUserName(user);
//			a.setService(s);
//			a.setEmployee(employee);
//			a.setCreateDate(Util.zonedNow());
//			a.setUser2(employee.getUser());
//			a.setAppointmentstatus(status);
//			a.setJoinId(joinId);
//			a.setStatusResponseDate(a.getCreateDate());
//			a.setComment(comment);
//
//			customPeriodRepository.getEntityManager().persist(a);
//
//			startOffset += s.getDuration();
//		}
//
//		customPeriodRepository.getEntityManager().flush();
//		return Response.ok().build();
//	}
}
