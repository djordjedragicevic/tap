package com.tap.rest;

import com.tap.common.Mail;
import com.tap.common.Util;
import com.tap.db.entity.User;
import com.tap.db.entity.UserVerification;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.security.Public;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;

@Path("verification")
public class UserVerificationService {
	@Inject
	UserVerificationRepository userVerificationRepository;
	@Inject
	UtilRepository utilRepository;

	@Path("data/{userId}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Public
	public Response getVerificationCodeData(@PathParam("userId") Integer userId) {

		Optional<UserVerification> userVerification = utilRepository.getSingleEntityBy(UserVerification.class, "user.id", userId);

		if (userVerification.isEmpty())
			throw new TAPException(ErrID.TAP_0);


		UserVerification uV = userVerification.get();
		LocalDateTime cT = Util.zonedNow();
		LocalDateTime cE = uV.getExpireTime();
		boolean cExpired = cT.isAfter(cE);

		User u = uV.getUser();

		return Response.ok(Map.of(
				"length", uV.getCode().length(),
				"time", cExpired ? 0 : ChronoUnit.MINUTES.between(cT, cE),
				"mail", u.getEmail()
		)).build();
	}

	@Path("resend/{userId}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Public
	public Response resend(@PathParam("userId") Integer userId) {

		Optional<UserVerification> ver = userVerificationRepository.resendNewCode(userId);

		if (ver.isPresent()) {
			UserVerification verification = ver.get();

			Mail.sendCode(verification.getCode(), verification.getUser().getEmail());

			long lastSec = ChronoUnit.SECONDS.between(verification.getCreateTime(), verification.getExpireTime());

			return Response.ok(lastSec / 60).build();
		}

		return Response.ok().build();
	}

	@Path("verify")
	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	@Public
	public Response verify(JsonObject params) {

		String code = params.getString("code");
		int userId = params.getInt("userId");

		userVerificationRepository.verify(userId, code);

		return Response.ok().build();
	}
}
