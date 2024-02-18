package com.tap.rest.sercice.user;

import com.tap.common.Util;
import com.tap.rest.dto.EmployeeDto;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.dto.ReviewDto;
import com.tap.rest.entity.Provider;
import com.tap.rest.entity.Review;
import com.tap.rest.entity.User;
import com.tap.rest.repository.ProviderRepository;
import com.tap.security.Public;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.time.LocalDateTime;
import java.util.*;

@Path("/provider")
@RequestScoped
public class ProviderService {
	private ProviderRepository providerRepository;

	public ProviderService() {

	}

	@Inject
	public ProviderService(ProviderRepository providerRepository) {
		this.providerRepository = providerRepository;
	}

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Object getProviderById(
			@PathParam("id") int id,
			@QueryParam("a") Byte getAbout,
			@QueryParam("e") Byte getEmployees,
			@QueryParam("w") Byte getWPs,
			@QueryParam("s") Byte getServices
	) {

		Map<String, Object> resp = new HashMap<>();
		boolean noFilters = getAbout == null && getEmployees == null && getWPs == null && getServices == null;

		try {
			if (noFilters || (getAbout != null && getAbout == 1))
				resp.put("about", providerRepository.getProviderData(id));

			if (noFilters || (getEmployees != null && getEmployees == 1))
				resp.put("employees", providerRepository.getProviderEmployeesDto(id));

			if (noFilters || (getWPs != null && getWPs == 1))
				resp.put("workPeriods", providerRepository.getProviderWorkPeriods(id));

			if (noFilters || (getServices != null && getServices == 1))
				resp.put("services", providerRepository.getProviderServices(id));

		} catch (Exception e) {
			throw new TAPException(ErrID.PROV_1);
		}

		return resp;
	}

	@GET
	@Path("/{id}/review/list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Response getProviderReviews(
			@PathParam("id") int pId,
			@QueryParam("sortBy") String sortBy,
			@QueryParam("sortKey") String sortKey
	) {

		return Response.ok(providerRepository.getReviews(pId, sortBy, sortKey)).build();
	}

	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Object getProviders(@QueryParam("tId") Integer typeId) {

		return providerRepository.getProviders(typeId);
	}

	@GET
	@Path("/type-list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Response getProvidersTypes() {

		return Response.ok(providerRepository.getProviderTypes()).build();
	}


}
