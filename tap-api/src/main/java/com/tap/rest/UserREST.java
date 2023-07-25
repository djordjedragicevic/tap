package com.tap.rest;

import com.tap.auth.Role;
import com.tap.auth.Secured;
import com.tap.db.dao.UserDAO;
import jakarta.inject.Inject;
import jakarta.json.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.Map;

@Path("user")
public class UserREST {

	@Inject
	UserDAO userDAO;

	@Path("by-token")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.ADMIN, Role.PROVIDER_OWNER, Role.EMPLOYEE, Role.USER})
	public Response getUserDataByToken(@Context SecurityContext securityContext) {

		String userId = securityContext.getUserPrincipal().getName();
		Map<String, Object> userData = null;
		if (userId != null && !userId.isEmpty())
			userData = userDAO.getUserData(Integer.parseInt(userId));

		return Response.ok(userData).build();
	}

	@Path("{id}/state")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public void changeUserState(@PathParam("id") int userId, JsonObject userState) {
		userDAO.updateState(userId, userState);
	}
}
