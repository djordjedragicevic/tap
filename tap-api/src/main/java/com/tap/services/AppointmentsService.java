package com.tap.services;

import com.tap.db.dao.AppointmentsDAO;
import com.tap.db.dao.CompanyDAO;
import com.tap.db.dto.CompanyWorkDayDTO;
import com.tap.db.dto.CompanyWorkInfoDTO;
import com.tap.db.entity.Appointment;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Path("appointments")
public class AppointmentsService {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public List<Appointment> getAppointments(@QueryParam("cId") Long companyId, @QueryParam("y") int y, @QueryParam("m") int m, @QueryParam("d") int d) {

//		CompanyWorkInfoDTO companyWorkInfoDTO = companyDAO.getWorkInfo(companyId);
//
		LocalDate date = LocalDate.of(y, m, d);
//		int day = date.getDayOfWeek().getValue();
//		CompanyWorkDayDTO cWD = companyWorkInfoDTO.getWorkDays().stream().filter(wD -> wD.day().intValue() == day).findFirst().orElseThrow();
//
//		LocalDateTime from = LocalDateTime.of(date, cWD.open());
//		LocalDateTime to = LocalDateTime.of(date, cWD.close());


		return appointmentsDAO.getAppointments(companyId, date);
	}

}
