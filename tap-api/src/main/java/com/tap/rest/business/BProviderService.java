package com.tap.rest.business;

import com.tap.security.Public;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@RequestScoped
@Path("business/provider/{pId}")
public class BProviderService {

	@Inject
	BProviderRepository bProviderRepository;

	@Path("services/{eId}")
	@GET
	@Public
	@Produces(MediaType.APPLICATION_JSON)
	public Response getServices (
			@NotNull @PathParam("pId") Integer pId,
			@NotNull @PathParam("eId") Integer eId
	){
		return Response.ok(bProviderRepository.getServicesOfEmployee(pId, eId)).build();
	}
}
