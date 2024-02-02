package com.tap.rest.sercice.user;

import com.tap.common.FSAsset;
import com.tap.common.Mail;
import com.tap.common.Util;
import com.tap.rest.dto.UserDto;
import com.tap.rest.entity.User;
import com.tap.rest.entity.UserRole;
import com.tap.rest.entity.UserVerification;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.sercice.Controller;
import com.tap.rest.repository.UserRepository;
import com.tap.security.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.json.*;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.eclipse.microprofile.config.ConfigProvider;

import java.io.*;
import java.time.LocalDateTime;
import java.util.*;

@Path("/user")
@RequestScoped
public class UserService {

	private UserRepository userRepository;
	private Controller controller;

	public UserService() {

	}
	@Inject
	public UserService(UserRepository userRepository, Controller controller) {
		this.userRepository = userRepository;
		this.controller = controller;
	}

	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Public
	@Path("/login")
	@Transactional
	public Response login(
			@HeaderParam(HttpHeaders.AUTHORIZATION) String bearer,
			Credentials credentials
	) {
		String t = controller.login(credentials, bearer, List.of(Role.USER));
		return Response.ok(Map.of("token", t)).build();
	}

	@Path("/create-account")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Public
	@Transactional
	public Response createAccount(JsonObject params) {

		String username = params.getString("username");
		String email = params.getString("email");
		String password = params.getString("password");

		if (username.isEmpty() || password.isEmpty() || email.isEmpty())
			throw new TAPException(ErrID.U_CACC_1);

		if (!Util.isMail(email))
			throw new TAPException(ErrID.INV_EMAIL_1);

		if (userRepository.getSingleEntityBy(User.class, "email", email).isPresent())
			throw new TAPException(ErrID.U_CACC_2, null, Map.of("email", email));

		if (userRepository.getSingleEntityBy(User.class, "username", username).isPresent())
			throw new TAPException(ErrID.U_CACC_3, null, Map.of("username", username));

		try {

			String code = Util.generateVerificationCode();

			String salt = Util.getRandomString(16, true);
			String encryptedPass = Security.encryptPassword(password, salt);

			User u = new User();
			u.setUsername(username);
			u.setEmail(email);
			u.setPassword(encryptedPass);
			u.setSalt(salt);
			u.setCreateDate(Util.zonedNow());

			long vCDuration = ConfigProvider.getConfig().getValue("tap.verification.code.duration", Long.class);
			LocalDateTime vCTime = LocalDateTime.now(Util.zone());
			LocalDateTime vCExpireTime = vCTime.plusMinutes(vCDuration);

			UserVerification validation = new UserVerification();
			validation.setCode(code);
			validation.setUser(u);
			validation.setCreateTime(vCTime);
			validation.setExpireTime(vCExpireTime);

			com.tap.rest.entity.Role role = userRepository.getSingleEntityBy(com.tap.rest.entity.Role.class, Map.of("name", com.tap.security.Role.USER.getName()));
			UserRole uR = new UserRole();
			uR.setUser(u);
			uR.setRole(role);

			userRepository.getEntityManager().persist(u);
			userRepository.getEntityManager().persist(validation);
			userRepository.getEntityManager().persist(uR);
			userRepository.getEntityManager().flush();

			Mail.sendCode(code, email);

			return Response.ok(u.getId()).build();

		} catch (Exception c) {
			throw new TAPException(ErrID.U_CACC_1);
		}
	}


	@Path("/profile")
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

	@Path("/profile")
	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	@Transactional
	public Response setUserDataByToken(
			@Context SecurityContext securityContext,
			@FormParam("image") EntityPart image,
			@FormParam("username") String username,
			@FormParam("email") String email,
			@FormParam("firstName") String firstName,
			@FormParam("lastName") String lastName,
			@FormParam("phone") String phone
	) {

		int userId = Security.getUserId(securityContext);

		if (username == null || username.isEmpty() || email == null || email.isEmpty() || !Util.isMail(email))
			throw new TAPException(ErrID.U_EACC_1);

		UserDto user = new UserDto()
				.setUsername(username)
				.setEmail(email)
				.setFirstName(firstName)
				.setLastName(lastName)
				.setPhone(phone);

		if (image != null) {
			try {
				String location = FSAsset.createUserProfileImage(image.getContent(), image.getMediaType().getSubtype(), userId);
				user.setImgpath(location);
			} catch (IOException e) {
				throw new TAPException(ErrID.U_EACC_1);
			}
		}

		userRepository.setUserData(userId, user);
		Map<String, Object> newUserData = userRepository.getUserData(userId);

		return Response.ok(newUserData).build();

	}

	@Path("/state")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Secured({Role.USER})
	@Transactional
	public void changeUserState(
			@Context SecurityContext sC,
			JsonObject userState
	) {

		int userId = Security.getUserId(sC);
		userRepository.updateState(userId, userState);
	}


}
