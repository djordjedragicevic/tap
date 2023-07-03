package com.tap.provider;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

@Path("provider")
public class ProviderREST {
	@Inject
	private ProviderDAO providerDAO;
	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getProviderById(@PathParam("id") long id) {
		return providerDAO.getProvider(id);

	}
	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getProviders(@QueryParam("cId") long cityId) {
		return providerDAO.getProviders(cityId);
	}


}
