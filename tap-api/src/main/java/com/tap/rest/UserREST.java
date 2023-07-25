package com.tap.rest;

import com.tap.auth.Role;
import com.tap.auth.Secured;
import com.tap.db.dao.UserDAO;
import jakarta.inject.Inject;
import jakarta.json.*;
import jakarta.ws.rs.*;
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

	@Path("{id}/state")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public void changeUserState(@PathParam("id") int userId, JsonObject userState){
		userDAO.updateState(userId, userState);
	}
}
