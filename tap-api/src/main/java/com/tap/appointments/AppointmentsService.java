package com.tap.appointments;

import com.tap.db.dao.CompanyDAO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Path("appointments")
@RequestScoped
public class AppointmentsService {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;
	@Inject
	private AppointmentController appointmentController;

	@GET
	@Path("/calendar")
	@Produces(MediaType.APPLICATION_JSON)
	public AppointmentsResp getAppointments(
			@QueryParam("cId") long companyId,
			@QueryParam("from") String from,
			@QueryParam("to") String to
	) {

		LocalDateTime dTFrom = LocalDateTime.parse(from, DateTimeFormatter.ISO_DATE_TIME);
		LocalDateTime dTTo = (to == null || to.isEmpty()) ? LocalDate.from(dTFrom).atTime(LocalTime.MAX) : LocalDateTime.parse(to, DateTimeFormatter.ISO_DATE_TIME);
		return appointmentController.getAppointments(companyId, dTFrom, dTTo, 0);
	}

	@GET
	@Path("/free")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getFreeAppointments(
			@QueryParam("services") String services,
			@QueryParam("cId") long cId,
			@QueryParam("from") String from,
			@QueryParam("to") String to
	) {
		List<Map<String, Object>> resp = new ArrayList<>();
		System.out.println(services + " " + cId + " " + from + " " + to);

		List<Long> serviceIds = Arrays.stream(services.split("_")).map(Long::valueOf).toList();
		List<Integer> serviceDurations = companyDAO.getServiceDurations(cId, serviceIds);
		serviceIds.forEach(System.out::println);
		if (!serviceDurations.isEmpty()) {
			int duration = serviceDurations.stream().reduce(Integer::sum).orElse(0);
			if (duration > 0) {
				LocalDateTime dTFrom = LocalDateTime.parse(from, DateTimeFormatter.ISO_DATE_TIME);
				LocalDateTime dTTo = (to == null || to.isEmpty()) ? LocalDate.from(dTFrom).atTime(LocalTime.MAX) : LocalDateTime.parse(to, DateTimeFormatter.ISO_DATE_TIME);
				return appointmentController.getAppointments(cId, dTFrom, dTTo, duration);
			}
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
