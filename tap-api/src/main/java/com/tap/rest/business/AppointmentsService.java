package com.tap.rest.business;

import com.tap.security.Public;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

@Path("/business/appointments")
@RequestScoped
public class AppointmentsService {

	@GET
	@Path("{id}")
	@Public
	public Response getAppointments(@PathParam("id") int id) {
		return Response.ok().build();
	}


}
