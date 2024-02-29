package com.tap.rest.sercice.user;

import com.tap.appointments.Utils;
import com.tap.common.Filter;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.dtor.ProviderDataDto;
import com.tap.rest.dtor.ServiceForSearchDto;
import com.tap.rest.dtor.ServiceSearchResultDto;
import com.tap.rest.repository.ProviderRepository;
import com.tap.rest.repository.UserRepository;
import com.tap.security.Public;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.*;

@Path("/provider")
@RequestScoped
public class ProviderService {
	private ProviderRepository providerRepository;
	private UserRepository userRepository;

	public ProviderService() {

	}

	@Inject
	public ProviderService(ProviderRepository providerRepository, UserRepository userRepository) {
		this.providerRepository = providerRepository;
		this.userRepository = userRepository;
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
	public List<ProviderDataDto> getProviders(
			@QueryParam("pt") Integer typeId,
			@QueryParam("term") String searchTerm
	) {

		Set<Integer> providerByServicesIds = new HashSet<>();
		Map<Integer, ServiceSearchResultDto> psMap = new LinkedHashMap<>();

		List<Filter> filters = new ArrayList<>();
		if (typeId != null)
			filters.add(new Filter("typeId", typeId, "p.providertype.id = :typeId"));

		if (searchTerm != null && !searchTerm.trim().isEmpty()) {
			searchTerm = Utils.formatSearchString(searchTerm);
			List<ServiceForSearchDto> services = providerRepository.searchProviderServicesByName(searchTerm);
			for (ServiceForSearchDto s : services) {
				providerByServicesIds.add(s.providerId());
				ServiceSearchResultDto sResult = psMap.computeIfAbsent(s.providerId(), k -> new ServiceSearchResultDto());
				sResult.setCount(sResult.getCount() + 1);
				if (sResult.getServices().size() < 3)
					sResult.getServices().add(s);
			}
		}

		List<ProviderDataDto> providers = providerRepository.getProviders(searchTerm, providerByServicesIds, filters, null);
		ServiceSearchResultDto tmpSR;
		if (!psMap.isEmpty()) {
			for (ProviderDataDto p : providers) {
				tmpSR = psMap.get(p.getId());
				if (tmpSR != null && tmpSR.getCount() > 0) {
					p.setServiceResult(tmpSR);
				}
			}
		}

		return providers;
	}

	@GET
	@Path("/prominent-list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Response getProminentProviders() {

		return Response.ok(providerRepository.getProminentProviders()).build();
	}

	@GET
	@Path("/type-list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Response getProvidersTypes() {

		return Response.ok(providerRepository.getProviderTypes()).build();
	}

	@GET
	@Path("/favorite-list")
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Response getFavoriteProviders(@Context SecurityContext sC) {

		int userId = Security.getUserId(sC);
		List<Integer> fPs = userRepository.getFavoriteProviderIds(userId);
		List<ProviderDataDto> providers = new ArrayList<>();
		if(fPs != null && !fPs.isEmpty())
			providers  = providerRepository.getProviders(null, new HashSet<>(fPs));

		return Response.ok(providers).build();
	}


}
