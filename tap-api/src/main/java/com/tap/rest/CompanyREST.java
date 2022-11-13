package com.tap.rest;

import com.tap.TAPResponse;
import com.tap.db.dao.CompanyDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.Map;

@Path("company")
public class CompanyREST {

	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Path("")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> getCompanies() {
		 return TAPResponse.wrap(companyDAO.getCompaniesBasic());
	}
}
