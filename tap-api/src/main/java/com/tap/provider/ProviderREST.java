package com.tap.provider;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
@Path("provider")
public class ProviderREST {
	@Inject
	private ProviderDAO providerDAO;

	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getProviders() {
		return providerDAO.getProviders();
	}
}
