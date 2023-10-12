package com.tap.rest;

import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.security.Credentials;
import com.tap.security.Public;
import com.tap.security.Secured;
import com.tap.security.Token;
import com.tap.db.entity.Role;
import com.tap.db.entity.User;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.*;

@Path("auth")
public class AuthService {
	@Inject
	UserRepository userRepository;
	@Inject
	AuthRepository authRepository;
	@Inject
	UtilRepository utilRepository;


	@POST
	@Path("login")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Public
	public Response login(
			@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer,
			Credentials credentials
	) {

		if (credentials == null || credentials.getPassword() == null || credentials.getUsername() == null || credentials.getPassword().isEmpty() || credentials.getUsername().isEmpty())
			throw new TAPException(ErrID.SIGN_IN_1);

		//Get user by credentials
		Optional<User> user = userRepository.getUserByCredentials(credentials.getUsername(), credentials.getPassword());
		if (user.isEmpty())
			throw new TAPException(ErrID.SIGN_IN_1);

		User u = user.get();
		int userId = u.getId();

		if (u.getVerified() != 1)
			return Response.ok(Map.of("unverified", true, "userId", userId)).build();


		List<String> roles = userRepository.getRoles(userId).stream().map(Role::getName).toList();


		//Check does user already has token in db, and replace it if so
		//TODO What to do if token exist but status is e.g WAITING_VALIDATION
		com.tap.db.entity.Token tokenRec;
		try {
			long rid = new Token(bearer).validate().getRid();
			Optional<com.tap.db.entity.Token> currToken = utilRepository.getEntity(com.tap.db.entity.Token.class, rid);
			tokenRec = currToken.orElse(null);
		} catch (Exception e) {
			tokenRec = null;
		}

		//If there is no token in DB, create new record
		if (tokenRec == null)
			tokenRec = authRepository.createTokenRecord(userId);

		//Generate new token, and save in DB
		try {
			Token newToken = new Token(userId, roles, tokenRec.getId());
			authRepository.setTokenJTI(tokenRec.getId(), newToken.getJti());

			return Response.ok(Map.of("token", newToken.generate())).build();
		} catch (Exception e) {
			return Response.status(Response.Status.UNAUTHORIZED).build();
		}
	}

	@GET
	@Path("check")
	@Secured
	public Response check() {
		return Response.ok(true).build();
	}
}
