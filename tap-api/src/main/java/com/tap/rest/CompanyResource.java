package com.tap.rest;

import com.tap.db.dao.CompanyDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("company")
public class CompanyResource {

	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getCompanies() {
		return TAPResponse.get(companyDAO.getCompanies());
	}
}
