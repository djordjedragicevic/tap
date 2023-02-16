package com.tap.appointments;

import com.tap.company.CompanyDAO;
import com.tap.db.dto.AppointmentDTO;
import com.tap.db.dto.EffectiveEmployeeWorkDayDTO;
import com.tap.db.dto.EmployeeDTO;
import com.tap.db.dto.EmployeeWorkDayDTO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.IntStream;

@Path("appointments")
@RequestScoped
public class AppointmentsREST {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;
	@Inject
	private AppointmentController appointmentController;

//	@GET
//	@Path("/calendar")
//	@Produces(MediaType.APPLICATION_JSON)
//	public AppointmentsResp getAppointments(
//			@QueryParam("cId") long companyId,
//			@QueryParam("from") String from,
//			@QueryParam("to") String to
//	) {
//
//		LocalDateTime dTFrom = LocalDateTime.parse(from, DateTimeFormatter.ISO_DATE_TIME);
//		LocalDateTime dTTo = (to == null || to.isEmpty()) ? LocalDate.from(dTFrom).atTime(LocalTime.MAX) : LocalDateTime.parse(to, DateTimeFormatter.ISO_DATE_TIME);
//		return appointmentController.getAppointments(companyId, dTFrom, dTTo, 0);
//	}

	@GET
	@Path("/free")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getFreeAppointments(
			@QueryParam("cityId") long cityId,
			@QueryParam("services") String services,
			@QueryParam("cId") long cId,
			@QueryParam("from") String from,
			@QueryParam("to") String to
	) {
		System.out.println(services + " " + cId + " " + from + " " + to);

		Object resp = null;

		LocalDateTime fromDT = Utils.parseDT(from).orElse(LocalDateTime.now());
		LocalDateTime toDT = Utils.parseDT(to).orElse(fromDT.plus(Utils.DAYS_TO_GET, ChronoUnit.DAYS));
//		int fromDay = fromDT.getDayOfWeek().getValue();
//		int toDay = toDT.getDayOfWeek().getValue();
		List<LocalDate> dates = IntStream.range(0, Utils.DAYS_TO_GET).mapToObj(i -> LocalDate.from(fromDT).plus(i, ChronoUnit.DAYS)).toList();

		List<EmployeeDTO> employees = companyDAO.getEmployeesForServices(cityId, Utils.parseIDs(services), cId);

		//Map<Long, EmployeeDTO> employeesMap = new HashMap<>();

		// Get valid employees
		if (!employees.isEmpty()) {
			//Get valid employee work days
			List<Long> eIds = employees.stream().map(EmployeeDTO::getId).toList();
			List<EmployeeWorkDayDTO> employeesWorkDays = companyDAO.getEmployeesWorkDays(eIds);

			if (!employeesWorkDays.isEmpty()) {
				for (LocalDate date : dates) {
					int day = date.getDayOfWeek().getValue();
					for (EmployeeDTO e : employees) {
						long eId = e.getId();
						List<EffectiveEmployeeWorkDayDTO> effectiveWD = employeesWorkDays.stream()
								.filter(emWD -> emWD.getEmployeeId() == eId)
								.filter(wd -> wd.getStartDay() == day)
								.map(wd -> new EffectiveEmployeeWorkDayDTO(
										e.getId(),
										LocalDateTime.of(date, wd.getStartTime()),
										LocalDateTime.of(date, wd.getEndTime()),
										LocalDateTime.of(date, wd.getBreakStartTime()),
										LocalDateTime.of(date, wd.getBreakEndTime())))
								.toList();

						effectiveWD.forEach(effWD -> e
								.addTimePeriod(date, new TimePeriod(
										effWD.getStart(),
										effWD.getEnd(),
										TimePeriod.FREE,
										TimePeriod.FREE_WORK_HOURS
								))
								.addTimePeriod(date, new TimePeriod(
										effWD.getBreakStart(),
										effWD.getBreakEnd(),
										TimePeriod.BUSY,
										TimePeriod.BUSY_BREAK
								)));
					}
				}


//				List<AppointmentDTO> apps = appointmentsDAO.getAppointments(fromDT, toDT, eIds);

			}

			resp = employees;
		}

		return resp;
	}

	@POST
	@Path("/book")
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Transactional
	public Object bookFreeAppointment(
			@FormParam("services") String services,
			@FormParam("uId") long uId,
			@FormParam("eId") long eId,
			@FormParam("start") String start,
			@FormParam("end") String end
	) {
		List<Long> srvcs = Arrays.stream(services.split("_")).map(Long::parseLong).toList();
		appointmentsDAO.bookAppointment(srvcs, uId, eId, LocalDateTime.parse(start), LocalDateTime.parse(end));
		return true;
	}

}
