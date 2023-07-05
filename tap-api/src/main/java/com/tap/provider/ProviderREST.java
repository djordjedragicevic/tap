package com.tap.provider;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Path("provider")
public class ProviderREST {
	@Inject
	private ProviderDAO providerDAO;

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getProviderById(@PathParam("id") long id) {


		Map<String, Object> resp = new LinkedHashMap<>(providerDAO.getProvider(id));

		Object services = providerDAO.getProviderServices(id);
		resp.put("services", providerDAO.getProviderServices(id));

		return resp;
	}

	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getProviders(@QueryParam("cId") long cityId) {
		return providerDAO.getProviders(cityId);
	}


}
