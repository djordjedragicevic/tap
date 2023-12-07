package com.tap.rest.user;

import com.tap.db.dto.EmployeeDto;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.security.Public;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.*;

@Path("provider")
public class ProviderService {
	@Inject
	private ProviderRepository providerRepository;

	@GET
	@Path("{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Object getProviderById(@PathParam("id") int id) {

		Map<String, Object> resp = new HashMap<>();
		Map<String, Object> about;

		try {

			about = providerRepository.getProviderData(id);
			resp.put("about", about);

			List<EmployeeDto> emps = providerRepository.getProviderEmployees(id);
			about.put("employees", emps);

			List<Map<String, Object>> wPs = providerRepository.getProviderWorkPeriods(id);
			about.put("workPeriods", wPs);

			List<String> imgs = providerRepository.getProviderMainImgs(id);
			resp.put("mainImg", imgs);

			Object services = providerRepository.getProviderServices(id);
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

		return providerRepository.getProviders(cityId);
	}


}
