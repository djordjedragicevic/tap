package com.tap.company;

import com.tap.db.dto.CompanyBasicDTO;
import com.tap.db.dto.CompanyServiceDTO;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.Map;

@Path("company")
public class CompanyREST {
	@Inject
	private CompanyDAO companyDAO;

	@GET
	@Path("list")
	@Produces(MediaType.APPLICATION_JSON)
	public Object getCompanies() {
		return companyDAO.getCompanyList();
	}

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Map<String, Object> getCompanyInfo(@PathParam("id") Long id) {
		CompanyBasicDTO companyBasicDTO = companyDAO.getCompany(id);
		List<CompanyServiceDTO> services = companyDAO.getCompanyServices(id);
		return Map.of("company", companyBasicDTO, "services", services);
	}

	@GET
	@Path("services/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public List<CompanyServiceDTO> getCompanyServices(@PathParam("id") Long companyId) {
		return companyDAO.getCompanyServices(companyId);
	}
}
