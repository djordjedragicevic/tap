package com.tap.rest;

import com.tap.common.Mail;
import com.tap.common.Util;
import com.tap.db.dto.UserDto;
import com.tap.db.entity.User;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.security.Public;
import com.tap.security.Role;
import com.tap.security.Secured;
import com.tap.security.Security;
import jakarta.inject.Inject;
import jakarta.json.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.*;

@Path("user")
public class UserService {

	@Inject
	UserRepository userRepository;
	@Inject
	UtilRepository utilRepository;

	@Path("create-account")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Response createAccount(JsonObject params) {

		String username = params.getString("username");
		String email = params.getString("email");
		String password = params.getString("password");

		if (username.isEmpty() || password.isEmpty() || email.isEmpty())
			throw new TAPException(ErrID.U_CACC_1);

		if (!Util.isMail(email))
			throw new TAPException(ErrID.INV_EMAIL_1);

		if (utilRepository.getSingleEntityBy(User.class, "email", email).isPresent())
			throw new TAPException(ErrID.U_CACC_2, null, Map.of("email", email));

		if (utilRepository.getSingleEntityBy(User.class, "username", username).isPresent())
			throw new TAPException(ErrID.U_CACC_3, null, Map.of("username", username));

		try {

			String code = Util.generateVerificationCode();

			int uId = userRepository.saveNewUser(username, email, password, Role.USER, code);

			Mail.sendCode(code, email);

			return Response.ok(uId).build();

		} catch (Exception c) {
			throw new TAPException(ErrID.U_CACC_1);
		}
	}


	@Path("profile")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public Response getUserDataByToken(@Context SecurityContext securityContext) {

		String userId = securityContext.getUserPrincipal().getName();
		Map<String, Object> userData = null;
		if (userId != null && !userId.isEmpty())
			userData = userRepository.getUserData(Integer.parseInt(userId));

		return Response.ok(userData).build();
	}

	@Path("profile")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public void setUserDataByToken(@Context SecurityContext securityContext, UserDto user) {
		int userId = Security.getUserId(securityContext);

		String username = user.getUsername();
		String email = user.getEmail();

		if (username == null || username.isEmpty() || email == null || email.isEmpty() || !Util.isMail(email))
			throw new TAPException(ErrID.U_EACC_1);

		userRepository.setUserData(userId, user);

	}

	@Path("{id}/state")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public void changeUserState(@PathParam("id") int userId, JsonObject userState) {
		userRepository.updateState(userId, userState);
	}
}
