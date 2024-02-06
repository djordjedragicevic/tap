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

@Path("provider")
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
	public Object getProviderById(@PathParam("id") int id) {

		Map<String, Object> resp = new HashMap<>();
		Map<String, Object> about;

		try {

			about = providerRepository.getProviderData(id);
			resp.put("about", about);

			List<EmployeeDto> emps = providerRepository.getProviderEmployeesDto(id);
			about.put("employees", emps);

			List<Map<String, Object>> wPs = providerRepository.getProviderWorkPeriods(id);
			about.put("workPeriods", wPs);

			Object services = providerRepository.getProviderServices(id);
			resp.put("services", services);

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

	@POST
	@Path("/{id}/review/add")
	@Produces(MediaType.APPLICATION_JSON)
	@Transactional
	@Public
	@Secured({Role.USER})
	public Response addProviderReview(
			@PathParam("id") int pId,
			@Context SecurityContext sC,
			ReviewDto reviewDto
	) {

		Review review = new Review();

		Provider p = providerRepository.getSingleActiveEntityById(Provider.class, pId);
		review.setProvider(p);

		int uId = Security.getUserId(sC);
		User u = providerRepository.getSingleActiveEntityById(User.class, uId);
		review.setUser(u);

		review.setMark(reviewDto.getMark());

		if (reviewDto.getComment() != null && !reviewDto.getComment().isEmpty())
			review.setComment(reviewDto.getComment());

		review.setCreatedAt(Util.zonedNow());

		//TODO MUST BE DELETED!!!
		User aU = providerRepository.getSingleActiveEntityById(User.class, 1);
		review.setUser2(aU);
		review.setApprovedAt(Util.zonedNow());

		providerRepository.getEntityManager().persist(review);

		return Response.ok().build();
	}

	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Object getProviders(@QueryParam("cId") long cityId) {

		return providerRepository.getProviders(cityId);
	}


}
