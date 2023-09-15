package com.tap.rest;

import com.tap.security.Public;
import com.tap.db.dao.ProviderDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.LinkedHashMap;
import java.util.Map;

@Path("provider")
public class ProviderREST {
	@Inject
	private ProviderDAO providerDAO;

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Object getProviderById(@PathParam("id") long id) {


		Map<String, Object> resp = new LinkedHashMap<>(providerDAO.getProvider(id));

		Object services = providerDAO.getProviderServices(id);
		resp.put("services",services);

		return resp;
	}

	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Object getProviders(@QueryParam("cId") long cityId) {
		return providerDAO.getProviders(cityId);
	}


}
