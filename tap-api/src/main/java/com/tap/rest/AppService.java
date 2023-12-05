package com.tap.rest;

import com.tap.rest.common.CController;
import com.tap.security.Credentials;
import com.tap.security.Public;
import com.tap.security.Role;
import com.tap.security.Token;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.Map;

@RequestScoped
@Path("app")
public class AppService {
	@Inject
	CController cController;

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Public
	@Path("login")
	@Transactional
	public Response login(
			@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer,
			Credentials credentials
	) {
		String t = cController.login(credentials, bearer, List.of(Role.USER));
		return Response.ok(Map.of("token", t)).build();
	}
}