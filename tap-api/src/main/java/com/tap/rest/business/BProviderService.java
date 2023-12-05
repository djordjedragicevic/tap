package com.tap.rest.business;

import com.tap.rest.common.CUserRepository;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import com.tap.security.Token;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.util.List;
import java.util.Map;

@RequestScoped
@Path("business/provider")
@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
public class BProviderService {

	@Inject
	BProviderRepository bProviderRepository;
	@Inject
	CUserRepository cUserRepository;

	@Path("services")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getEmployeeServices(
			//@NotNull @PathParam("eId") Integer eId,
			@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer
	) {
		int eId =  new Token(bearer).getEmployeeId();
		return Response.ok(bProviderRepository.getServicesOfEmployee(eId)).build();
	}

	@Path("employee-data")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	public Response getEmployeeData(@Context SecurityContext sC) {
		int userId = Security.getUserId(sC);

		Map<String, Object> employee = bProviderRepository.getEmployeeFullData(userId);
		List<String> roles = cUserRepository.getRoleNames(userId);
		employee.put("roles", roles);

		return Response.ok(employee).build();
	}
}
