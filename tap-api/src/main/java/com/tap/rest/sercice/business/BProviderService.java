package com.tap.rest.sercice.business;

import com.tap.rest.repository.ProviderRepository;
import com.tap.rest.repository.UserRepository;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import com.tap.security.Token;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;

import java.util.List;
import java.util.Map;

@RequestScoped
@Path("business/provider")
@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
public class BProviderService {
	private ProviderRepository providerRepository;
	private UserRepository userRepository;

	public BProviderService() {

	}

	@Inject
	public BProviderService(ProviderRepository providerRepository, UserRepository userRepository) {
		this.providerRepository = providerRepository;
		this.userRepository = userRepository;
	}

	@Path("services")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response getEmployeeServices(@Context SecurityContext sC) {
		long eId = Security.getEmployeeId(sC);
		return Response.ok(providerRepository.getServicesOfEmployee((int) eId)).build();
	}

	@Path("employee-data")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.PROVIDER_OWNER, Role.EMPLOYEE})
	public Response getEmployeeData(@Context SecurityContext sC) {
		int userId = Security.getUserId(sC);

		Map<String, Object> employee = providerRepository.getEmployeeFullData(userId);
		List<String> roles = userRepository.getRoleNames(userId);
		employee.put("roles", roles);

		return Response.ok(employee).build();
	}
}
