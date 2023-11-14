package com.tap.rest.business;

import com.tap.appointments.ProviderWorkInfo;
import com.tap.appointments.Utils;
import com.tap.common.*;
import com.tap.db.dto.EmployeeDto;
import com.tap.db.entity.*;
import com.tap.rest.common.CAppointmentRepository;
import com.tap.security.Public;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Path("/business/appointments")
@RequestScoped
public class BAppointmentsService {
	@Inject
	BAppointmentRepository bAppointmentRepository;
	@Inject
	CAppointmentRepository cAppointmentRepository;

	@GET
	@Path("{pId}")
	@Public
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAppointments(
			@NotNull @PathParam("pId") Integer pId,
			@NotNull @QueryParam("date") Date d
	) {

		List<EmployeeDto> emps = bAppointmentRepository.getEmployees(pId)
				.stream()
				.map(e -> new EmployeeDto()
						.setId(e.getId())
						.setName(e.getName())
						.setImagePath(e.getImagePath()))
				.toList();

		List<Integer> eIds = emps.stream().mapToInt(EmployeeDto::getId).boxed().toList();

		LocalDateTime from = Util.zonedDT(d);
		LocalDate date = from.toLocalDate();

		ProviderWorkInfo pWI = this.generatePWI(pId, eIds, date, emps);

		return Response.ok(pWI).build();

	}

	@POST
	@Path("/accept/{appId}/{sId}")
	@Public
	@Transactional
	public Response acceptAppointment(
			@NotNull @PathParam("appId") Long appId,
			@NotNull @PathParam("sId") Integer sId
	) {

		bAppointmentRepository.acceptAppointment(appId, sId, Util.zonedNow());
		return Response.ok().build();
	}

	@POST
	@Path("/reject/{appId}/{sId}")
	@Public
	@Transactional
	public Response rejectAppointment(
			@NotNull @PathParam("appId") Long appId,
			@NotNull @PathParam("sId") Integer sId
	) {

		bAppointmentRepository.rejectAppointment(appId, sId, Util.zonedNow());
		return Response.ok().build();
	}

	private ProviderWorkInfo generatePWI(Integer pId, List<Integer> eIds, LocalDate date, List<EmployeeDto> emps) {

		List<Object[]> apps = bAppointmentRepository.getAppointmentsAtDay(eIds, date);
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

		Appointment tmpA;
		Service tmpS;
		Employee tmpE;
		User tmpU;
		TimePeriod tmpTP;
		String status;
		//Appointments
		for (Object[] a : apps) {
			tmpA = (Appointment) a[0];
			tmpS = (Service) a[1];
			tmpE = (Employee) a[2];
			tmpU = (User) a[3];

			tmpTP = Utils.adjustPeriodToOnaDate(date, tmpA.getStart(), tmpA.getEnd());
			pWI.getEmployeeById(tmpE.getId())
					.getTimeline()
					.add(new NamedTimePeriodExt(
							tmpTP.getStart(),
							tmpTP.getEnd(),
							TypedTimePeriod.CLOSE,
							NamedTimePeriod.CLOSE_APPOINTMENT,
							Map.of(
									"id", tmpA.getId(),
									"service", Map.of(
											"id", tmpS.getId(),
											"name", tmpS.getName(),
											"duration", tmpS.getDuration(),
											"price", tmpS.getPrice()
									),
									"eId", tmpE.getId(),
									"eName", tmpE.getName(),
									"uId", tmpU.getId(),
									"uUsername", tmpU.getUsername(),
									"uEmail", tmpU.getEmail(),
									"status", a[4]
							)
					));
		}

		//Busy periods
		NamedTimePeriodExt tmpNTPE;
		boolean isProviderLevel;
		for (BusyPeriod bP : bps) {
			isProviderLevel = bP.getProvider() != null;
			tmpTP = bP.getRepeattype() != null ?
					Utils.adjustRepeatablePeriodToOnaDate(date, bP.getStart(), bP.getEnd(), bP.getRepeattype().getName())
					:
					Utils.adjustPeriodToOnaDate(date, bP.getStart(), bP.getEnd());

			tmpNTPE = new NamedTimePeriodExt(
					tmpTP.getStart(),
					tmpTP.getEnd(),
					TypedTimePeriod.CLOSE,
					isProviderLevel ? NamedTimePeriod.CLOSE_PROVIDER_BUSY : NamedTimePeriod.CLOSE_EMPLOYEE_BUSY,
					Map.of(
							"id", bP.getId(),
							"comment", bP.getComment(),
							"periodType", bP.getPeriodtype().getName()
					)
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
			isProviderLevel = wP.getProvider() != null;
			isClose = wP.getPeriodtype().getOpen() == 0;

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
