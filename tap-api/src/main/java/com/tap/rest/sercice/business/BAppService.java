package com.tap.rest.sercice.business;

import com.tap.common.FSAsset;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.sercice.Controller;
import com.tap.security.*;
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
@Path("business/app")
public class BAppService {
	private Controller controller;

	public BAppService() {

	}

	@Inject
	public BAppService(Controller controller) {
		this.controller = controller;
	}

	@POST
	@Transactional
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Public
	@Path("login")
	public Response login(
			@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer,
			Credentials credentials
	) {
		String t = controller.login(credentials, bearer, List.of(Role.PROVIDER_OWNER, Role.EMPLOYEE));

		return Response.ok(Map.of("token", t)).build();
	}

	@POST
	@Path("logout")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Transactional
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	public Response logout(@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer) {
		try {
			Token token = new Token(bearer);
			controller.logout(token);
			return Response.ok().build();
		} catch (Exception e) {
			throw new TAPException(ErrID.TAP_0);
		}
	}

//	@GET
//	@Path("asset/download")
//	@Produces(MediaType.APPLICATION_OCTET_STREAM)
//	public Response getImage(@QueryParam("lct") String location) {
//		return FSAsset.readFile(location).build();
//	}
}
