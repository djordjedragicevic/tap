package com.tap.rest.business;

import com.tap.appointments.ProviderWorkInfo;
import com.tap.appointments.Utils;
import com.tap.common.*;
import com.tap.db.dtor.AppointmentDtoSimple;
import com.tap.db.entity.BusyPeriod;
import com.tap.db.entity.Employee;
import com.tap.db.entity.WorkPeriod;
import com.tap.rest.common.CAppointmentRepository;
import com.tap.rest.common.CUtilRepository;
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
public class BAppointmentsResource {
	@Inject
	BAppointmentRepository bAppointmentRepository;
	@Inject
	CAppointmentRepository cAppointmentRepository;
	@Inject
	CUtilRepository cUtilRepository;
	@Inject
	BProviderRepository bProviderRepository;

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

		Employee e = cUtilRepository.getSingleEntityBy(Employee.class, Map.of(
				"user.id", userId,
				"active", 1
		));

		int pId = e.getProvider().getId();
		List<Employee> emps = isOwner ? bProviderRepository.getProviderEmployees(pId) : List.of(e);

		ProviderWorkInfo pWI = this.generatePWI(pId, date, emps);

		return Response.ok(pWI).build();
	}

	@GET
	@Path("/waiting")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getWaitingAppointments(@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer) {
		int pId = new Token(bearer).getProviderId();
		List<AppointmentDtoSimple> apps = bAppointmentRepository.getWaitingAppointments(pId, Util.zonedNow());
		return Response.ok(apps).build();
	}

	@POST
	@Path("/accept/{appId}/{sId}")
	@Transactional
	public Response acceptAppointment(
			@NotNull @PathParam("appId") Long appId,
			@NotNull @PathParam("sId") Integer sId
	) {

		bAppointmentRepository.acceptAppointment(appId, sId, Util.zonedNow());
		return Response.ok().build();
	}

	@POST
	@Path("/accept/multi")
	@Transactional
	@Consumes(MediaType.APPLICATION_JSON)
	public Response acceptAppointmentMulti(JsonArray appIds) {
		List<Long> apps = appIds.stream().mapToLong(v -> Long.parseLong(v.toString())).boxed().toList();
		bAppointmentRepository.acceptAppointmentMulti(apps);
		return Response.ok().build();
	}

	@POST
	@Path("/reject/{appId}/{sId}")
	@Transactional
	public Response rejectAppointment(
			@NotNull @PathParam("appId") Long appId,
			@NotNull @PathParam("sId") Integer sId
	) {

		bAppointmentRepository.rejectAppointment(appId, sId, Util.zonedNow());
		return Response.ok().build();
	}


	private ProviderWorkInfo generatePWI(Integer pId, LocalDate date, List<Employee> emps) {
		List<Integer> eIds = emps.stream().mapToInt(Employee::getId).boxed().toList();
		List<AppointmentDtoSimple> apps = bAppointmentRepository.getWAAppointmentsAtDay(eIds, date);
		List<BusyPeriod> bps = cAppointmentRepository.getBusyPeriodsAtDay(pId, eIds, date);
		List<WorkPeriod> wps = cAppointmentRepository.getBreaksPeriodsAtDay(pId, eIds, date.getDayOfWeek().getValue());


		ProviderWorkInfo pWI = new ProviderWorkInfo(pId)
				.setAtDay(date)
				.setEmployees(new ArrayList<>())
				.setWorkPeriods(new ArrayList<>());

		emps.forEach(e -> pWI.getEmployees().add(
						new ProviderWorkInfo.Employee(e.getId())
								.setName(e.getName())
								.setImagePath(e.getImagePath())
								.setTimeline(new ArrayList<>())
								.setWorkPeriods(new ArrayList<>())
				)
		);

		TimePeriod tmpTP;
		//Appointments
		for (AppointmentDtoSimple a : apps) {
			tmpTP = Utils.adjustPeriodToOnaDate(date, a.start(), a.end());
			pWI.getEmployeeById(a.eId())
					.getTimeline()
					.add(new NamedTimePeriodExt(
							tmpTP.getStart(),
							tmpTP.getEnd(),
							TypedTimePeriod.CLOSE,
							NamedTimePeriod.CLOSE_APPOINTMENT,
							a
					));
		}

		//Busy periods
		NamedTimePeriodExt tmpNTPE;
		boolean isProviderLevel;
		Map<String, Object> tmpData;
		for (BusyPeriod bP : bps) {
			isProviderLevel = bP.getEmployee() == null;
			tmpTP = bP.getRepeattype() != null ?
					Utils.adjustRepeatablePeriodToOnaDate(date, bP.getStart(), bP.getEnd(), bP.getRepeattype().getName())
					:
					Utils.adjustPeriodToOnaDate(date, bP.getStart(), bP.getEnd());

			tmpData = new HashMap<>();
			tmpData.put("id", bP.getId());
			tmpData.put("comment", bP.getComment());
			tmpData.put("periodType", bP.getPeriodtype().getName());

			tmpNTPE = new NamedTimePeriodExt(
					tmpTP.getStart(),
					tmpTP.getEnd(),
					TypedTimePeriod.CLOSE,
					isProviderLevel ? NamedTimePeriod.CLOSE_PROVIDER_BUSY : NamedTimePeriod.CLOSE_EMPLOYEE_BUSY,
					tmpData
			);
			if (isProviderLevel)
				for (ProviderWorkInfo.Employee e : pWI.getEmployees())
					e.getTimeline().add(tmpNTPE);
			else
				pWI.getEmployeeById(bP.getEmployee().getId()).getTimeline().add(tmpNTPE);
		}

		//Work periods (breaks and working time)
		boolean isClose;
		for (WorkPeriod wP : wps) {
			isProviderLevel = wP.getEmployee() == null;
			isClose = !wP.getPeriodtype().isOpen();

			//Breaks
			if (isClose) {
				if (isProviderLevel)
					for (ProviderWorkInfo.Employee e : pWI.getEmployees())
						e.getTimeline().add(new NamedTimePeriodExt(
								wP.getStartTime(),
								wP.getEndTime(),
								TypedTimePeriod.CLOSE,
								NamedTimePeriod.CLOSE_PROVIDER_BREAK,
								Map.of(
										"id", wP.getId(),
										"periodType", wP.getPeriodtype().getName()
								)
						));
				else
					pWI.getEmployeeById(wP.getEmployee().getId()).getTimeline().add(new NamedTimePeriodExt(
							wP.getStartTime(),
							wP.getEndTime(),
							TypedTimePeriod.CLOSE,
							NamedTimePeriod.CLOSE_EMPLOYEE_BREAK,
							Map.of(
									"id", wP.getId(),
									"periodType", wP.getPeriodtype().getName()
							)
					));

			}
			//Working time
			else {
				if (isProviderLevel)
					pWI.getWorkPeriods().add(new TimePeriod(wP.getStartTime(), wP.getEndTime()));
				else
					pWI.getEmployeeById(wP.getEmployee().getId())
							.getWorkPeriods().add(new TimePeriod(wP.getStartTime(), wP.getEndTime()));
			}

		}

		//Finally sort periods
		pWI.getWorkPeriods().sort(Comparator.comparing(TimePeriod::getStart));
		pWI.getEmployees().forEach(e -> e.getTimeline().sort(Comparator.comparing(TimePeriod::getStart)));

		return pWI;
	}


}
