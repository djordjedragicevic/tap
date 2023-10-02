package com.tap.rest;

import com.tap.db.dto.EmployeeDto;
import com.tap.db.dto.WorkPeriodDto;
import com.tap.db.entity.WorkPeriod;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.security.Public;
import com.tap.db.dao.ProviderDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.*;

@Path("provider")
public class ProviderREST {
	@Inject
	private ProviderDAO providerDAO;

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Object getProviderById(@PathParam("id") int id) {

		Map<String, Object> resp = new HashMap<>();

		try {

			Map<String, Object> prov = providerDAO.getProviderData(id);
			resp.put("about", prov);

			List<WorkPeriodDto> wPs = providerDAO.getProviderWorkPeriods(id);
			((Map<String, Object>) resp.get("about")).put("workPeriods", wPs);

			List<String> imgs = providerDAO.getProviderMainImgs(id);
			resp.put("mainImg", imgs);

			List<EmployeeDto> emps = providerDAO.getProviderEmployees(id);
			((Map<String, Object>) resp.get("about")).put("employees", emps);

			Object services = providerDAO.getProviderServices(id);
			resp.put("services", services);

		} catch (Exception e) {
			System.err.println(e);
			throw new TAPException(ErrID.PROV_1);
		}

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
