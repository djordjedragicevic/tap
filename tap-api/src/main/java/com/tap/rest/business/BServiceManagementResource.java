package com.tap.rest.business;

import com.tap.rest.user.ProviderRepository;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import jakarta.inject.Inject;
import jakarta.inject.Provider;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/business/service-management")
@Secured({Role.PROVIDER_OWNER})
public class BServiceManagementResource {


	private final BServiceManagementRepository bServiceManagementRepository;

	private final ProviderRepository providerRepository;


	@Inject
	public BServiceManagementResource(BServiceManagementRepository bServiceManagementRepository, ProviderRepository providerRepository) {
		this.bServiceManagementRepository = bServiceManagementRepository;
		this.providerRepository = providerRepository;
	}


	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAllServices(@Context SecurityContext sC) {
		long pId = Security.getProviderId(sC);
		return Response.ok(providerRepository.getProviderServices(pId)).build();
	}

}
