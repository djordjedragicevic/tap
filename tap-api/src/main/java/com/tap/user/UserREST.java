package com.tap.user;

import jakarta.inject.Inject;
import jakarta.json.*;
import jakarta.json.bind.JsonbBuilder;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.StringReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeUserState(@PathParam("id") long userId, JsonObject userState){
		userDAO.updateState(userId, userState);
		return Response.ok().build();
	}
}
