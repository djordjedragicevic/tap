package com.tap.rest.sercice.user;

import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.dtor.ProviderSearchResultDto;
import com.tap.rest.dtor.ServiceForSearchDto;
import com.tap.rest.dtor.ServiceSearchResultDto;
import com.tap.rest.repository.ProviderRepository;
import com.tap.security.Public;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
	public Object getProviders(
			@QueryParam("tid") Integer typeId,
			@QueryParam("term") String term
	) {

		Set<Integer> providerByServicesIds = new HashSet<>();
		Map<Integer, ServiceSearchResultDto> psMap = new LinkedHashMap<>();

		if (term != null && !term.trim().isEmpty()) {
			List<ServiceForSearchDto> services = providerRepository.searchProviderServicesByServiceName(term);
			for (ServiceForSearchDto s : services) {
				providerByServicesIds.add(s.providerId());
				ServiceSearchResultDto sResult = psMap.computeIfAbsent(s.providerId(), k -> new ServiceSearchResultDto());
				sResult.setCount(sResult.getCount() + 1);
				//if (sResult.getServices().size() < 1)
					sResult.getServices().add(s);
			}
		}

		List<ProviderSearchResultDto> providers = providerRepository.searchFilterProviders(term, providerByServicesIds);
		ServiceSearchResultDto tmpSR;
		if (!psMap.isEmpty()) {
			for (ProviderSearchResultDto p : providers) {
				tmpSR = psMap.get(p.getId());
				if (tmpSR != null && tmpSR.getCount() > 0) {
					p.setServiceResult(tmpSR);
				}
			}
		}

		return providers;
	}

	@GET
	@Path("/type-list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Response getProvidersTypes() {

		return Response.ok(providerRepository.getProviderTypes()).build();
	}


}
