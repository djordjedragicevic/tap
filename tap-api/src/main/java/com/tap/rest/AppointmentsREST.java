package com.tap.rest;

import com.tap.TAPResponse;
import com.tap.db.dao.AppointmentsDAO;
import com.tap.db.dao.CompanyDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.HashMap;
import java.util.Map;

@Path("appointments")
public class AppointmentsREST {
	@Inject
	private AppointmentsDAO appointmentsDAO;
	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getAppointments(@QueryParam("companyId") Long companyId, @QueryParam("duration") Long duration) {
		return companyDAO.getWorkInfo(companyId);


	}

}
