package com.tap.rest;

import com.tap.common.Mail;
import com.tap.common.Util;
import com.tap.db.entity.User;
import com.tap.db.entity.UserVerification;
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
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDateTime;
import java.util.*;

@Path("user")
public class UserService {

	@Inject
	UserRepository userRepository;
	@Inject
	UtilRepository utilRepository;

	@Path("create-account")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	public Response createAccount(JsonObject params) {

		String userName = params.getString("username");
		String email = params.getString("email");
		String password = params.getString("password");

		if (userName.isEmpty() || password.isEmpty() || email.isEmpty())
			throw new TAPException(ErrID.U_CACC_1);

		if (!Util.isMail(email))
			throw new TAPException(ErrID.INV_EMAIL_1);

		if (utilRepository.getSingleEntityBy(User.class, "email", email).isPresent())
			throw new TAPException(ErrID.U_CACC_2, null, Map.of("email", email));

		if (utilRepository.getSingleEntityBy(User.class, "username", userName).isPresent())
			throw new TAPException(ErrID.U_CACC_3, null, Map.of("username", userName));

		try {
			String salt = Util.getRandomString(16, true);
			String encryptedPass = Security.encryptPassword(password, salt);

			User newUser = new User();
			newUser.setUsername(userName);
			newUser.setEmail(email);
			newUser.setPassword(encryptedPass);
			newUser.setSalt(salt);
			newUser.setCreateDate(Util.zonedNow());

			int codeLength = ConfigProvider.getConfig().getValue("tap.verification.code.length", Integer.class);
			String code = Util.generateVerificationCode(codeLength);

			userRepository.saveNewUser(newUser, code);

			Mail.sendCode(code, email);

			return Response.ok(newUser.getId()).build();

		} catch (Exception c) {
			throw new TAPException(ErrID.U_CACC_1);
		}
	}


	@Path("by-token")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.ADMIN, Role.PROVIDER_OWNER, Role.EMPLOYEE, Role.USER})
	public Response getUserDataByToken(@Context SecurityContext securityContext) {

		String userId = securityContext.getUserPrincipal().getName();
		Map<String, Object> userData = null;
		if (userId != null && !userId.isEmpty())
			userData = userRepository.getUserData(Integer.parseInt(userId));

		return Response.ok(userData).build();
	}

	@Path("{id}/state")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	public void changeUserState(@PathParam("id") int userId, JsonObject userState) {
		userRepository.updateState(userId, userState);
	}
}
