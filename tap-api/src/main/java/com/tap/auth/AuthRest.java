package com.tap.auth;

import com.tap.common.UtilDAO;
import com.tap.db.entity.User;
import com.tap.user.UserDAO;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.Optional;

@Path("auth")
public class AuthRest {
	@Inject
	UserDAO userDAO;
	@Inject
	AuthDao authDao;

	@Path("login")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public Response login(@FormParam("username") String username, @FormParam("password") String password) {
		try {
			User u = authenticate(username, password);

			String token = generateToken(u);

			return Response.ok(token).build();

		} catch (Exception e) {
			return Response.status(Response.Status.FORBIDDEN).build();
		}
	}

	private User authenticate(String username, String password) throws AuthException {
		Optional<User> u = userDAO.getUserByCredentials(username, password);
		if(u.isEmpty())
			throw new AuthException();

		return u.get();
	}

	private String generateToken(User u) {
		String token =  "ToKEn!_" + u.getId();
		authDao.saveToken(u, token);
		return token;
	}
}
