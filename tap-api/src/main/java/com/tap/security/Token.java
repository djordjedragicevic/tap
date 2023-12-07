package com.tap.security;

import com.tap.common.Util;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

public class Token {
	public static final String VALID = "VALID";

	private String iss;
	private String schema;
	private String secret;
	private JsonObject payload;
	private final String eHeader;
	private String ePayload;
	private String eSignature;

	public Token() {
		this.readConfigs();
		this.eHeader = encode(Json.createObjectBuilder()
				.add("typ", "JWT")
				.add("alg", "HS256")
				.build());
	}

	public Token(int sub, List<String> aud, long rid) throws Exception {
		this();
		this.payload = Json.createObjectBuilder()
				.add("sub", sub)
				.add("iss", iss)
				.add("aud", Json.createArrayBuilder(aud).build())
				.add("rid", rid)
				.add("jti", UUID.randomUUID().toString())
				.add("iat", ZonedDateTime.now(Util.zone()).toEpochSecond())
				.build();

		this.postConstrict();

	}

	public Token(int sub, List<String> aud, long rid, int providerId, int employeeId) throws Exception {
		this();
		this.payload = Json.createObjectBuilder()
				.add("sub", sub)
				.add("iss", iss)
				.add("aud", Json.createArrayBuilder(aud).build())
				.add("rid", rid)
				.add("jti", UUID.randomUUID().toString())
				.add("iat", ZonedDateTime.now(Util.zone()).toEpochSecond())
				.add("providerId", providerId)
				.add("employeeId", employeeId)
				.build();

		this.postConstrict();
	}

	public Token(String authHeader) throws TAPException {
		this.readConfigs();
		if (!isToken(authHeader))
			//throw new Exception("Invalid token format");
			throw new TAPException(ErrID.TAP_0);

		String t = authHeader.substring(schema.length()).trim();
		String[] tParts = t.split("\\.");

		if (!isValidParts(tParts))
			//throw new Exception("Invalid token content");
			throw new TAPException(ErrID.TAP_0);

		this.eHeader = tParts[0];
		this.ePayload = tParts[1];
		this.eSignature = tParts[2];

		try {
			this.payload = decode(this.ePayload);
		} catch (Exception e) {
			throw new TAPException(ErrID.TAP_0);
		}
	}

	public Token validate() throws Exception {
		if (!this.isValid())
			//throw new Exception("Token is not valid");
			throw new TAPException(ErrID.TAP_0);

		return this;
	}

	public boolean isValid() {
		return this.eSignature != null &&
			   this.ePayload != null &&
			   this.eHeader != null &&
			   this.payload.getString("iss").equals(iss) &&
			   !this.eSignature.isEmpty() &&
			   this.eSignature.equals(this.sign(this.eHeader + "." + this.ePayload, secret));
	}

	public String generate() {
		return eHeader + "." + ePayload + "." + eSignature;
	}

	public String getJti() {
		return this.payload.getString("jti");
	}

	public List<String> getAud() {
		List<String> reps = new ArrayList<>();
		JsonArray aud = this.payload.getJsonArray("aud");
		for (int i = 0, s = aud.size(); i < s; i++)
			reps.add(aud.getString(i));

		return reps;
	}

	public long getRid() {
		return this.payload.getJsonNumber("rid").longValue();
	}

	public int getSub() {
		return this.payload.getJsonNumber("sub").intValue();
	}

	public int getProviderId() {
		if (this.payload.containsKey("providerId"))
			return this.payload.getJsonNumber("providerId").intValue();
		else
			return -1;
	}

	public int getEmployeeId() {
		if (this.payload.containsKey("employeeId"))
			return this.payload.getJsonNumber("employeeId").intValue();
		else
			return -1;
	}


	private String encode(JsonObject data) {
		return Base64.getUrlEncoder().withoutPadding().encodeToString(data.toString().getBytes(StandardCharsets.UTF_8));
	}

	private String encode(byte[] data) {
		return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
	}

	private JsonObject decode(String data) throws Exception {
		byte[] dData = Base64.getUrlDecoder().decode(data);

		try (Jsonb jsonb = JsonbBuilder.create()) {
			return jsonb.fromJson(new String(dData, StandardCharsets.UTF_8), JsonObject.class);
		}
	}

	private String sign(String data, String secret) {
		try {
			Mac sha256Hmac = Mac.getInstance("HmacSHA256");
			SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
			sha256Hmac.init(secretKey);
			return encode(sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
		} catch (NoSuchAlgorithmException | InvalidKeyException e) {
			return null;
		}
	}

	private boolean isToken(String authHeader) {
		return authHeader != null &&
			   authHeader.toLowerCase().startsWith(schema.toLowerCase() + " ") &&
			   authHeader.length() > (schema.length() + 1);
	}

	private boolean isValidParts(String[] parts) {
		return parts != null &&
			   parts.length == 3 &&
			   parts[0] != null && !parts[0].isEmpty() &&
			   parts[1] != null && !parts[1].isEmpty() &&
			   parts[2] != null && !parts[2].isEmpty();
	}

	private void postConstrict() throws Exception {
		this.ePayload = encode(payload);
		this.eSignature = this.sign(eHeader + "." + ePayload, secret);

		if (this.eSignature == null || this.eSignature.isEmpty())
			throw new Exception("Token can't be generated");
	}

	private void readConfigs() {
		this.iss = ConfigProvider.getConfig().getValue("tap.token.iss", String.class);
		this.schema = ConfigProvider.getConfig().getValue("tap.token.schema", String.class);
		this.secret = ConfigProvider.getConfig().getValue("tap.token.secret", String.class);

	}


}
