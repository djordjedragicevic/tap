package com.tap.user;

import jakarta.inject.Inject;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("user")
public class UserREST {

	@Inject
	UserDAO userDAO;

	@Path("by-token")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	public Response getUserData(@FormParam("token") String token) {
		return Response.ok(userDAO.getUserData(1)).build();
	}
}
