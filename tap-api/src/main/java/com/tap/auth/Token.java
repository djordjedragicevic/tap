package com.tap.auth;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

public class Token {
	public static final String VALID = "VALID";
	private static final String ISS = "tap.app";
	private static final String SECRET = "v1pS#$VAG/6%3*S#4VcAWMKsZ]s*w}XR=9i~l|A1I8]\"WHS%i}<P1@Hcr<`q;v[z";
	private static final String AUTH_SCHEME = "Bearer";
	private JsonObject payload;
	private String eHeader;
	private String ePayload;
	private String eSignature;

	public Token() {
		this.eHeader = encode(Json.createObjectBuilder()
				.add("typ", "JWT")
				.add("alg", "HS256")
				.build());
	}

	public Token(int sub, List<String> aud, long rid) throws Exception {
		this();
		this.payload = Json.createObjectBuilder()
				.add("sub", sub)
				.add("iss", ISS)
				.add("aud", Json.createArrayBuilder(aud).build())
				.add("rid", rid)
				.add("jti", UUID.randomUUID().toString())
				.add("iat", LocalDateTime.now().toEpochSecond(ZoneOffset.UTC))
				.build();

		this.ePayload = encode(payload);
		this.eSignature = this.sign(eHeader + "." + ePayload, SECRET);

		if (this.eSignature == null || this.eSignature.isEmpty())
			throw new Exception("Token can't be generated");

	}

	public Token(String authHeader) throws Exception {
		if (!isToken(authHeader))
			throw new Exception("Invalid token format");

		String t = authHeader.substring(AUTH_SCHEME.length()).trim();
		String[] tParts = t.split("\\.");

		if (!isValidParts(tParts))
			throw new Exception("Invalid token content");

		this.eHeader = tParts[0];
		this.ePayload = tParts[1];
		this.eSignature = tParts[2];

		this.payload = decode(this.ePayload);
	}

	public Token validate() throws Exception {
		if (!this.isValid())
			throw new Exception("Token is not valid");

		return this;
	}

	public boolean isValid() {
		return this.eSignature != null &&
			   this.ePayload != null &&
			   this.eHeader != null &&
			   this.payload.getString("iss").equals(ISS) &&
			   !this.eSignature.isEmpty() &&
			   this.eSignature.equals(this.sign(this.eHeader + "." + this.ePayload, SECRET));
	}

	public String generate() {
		return eHeader + "." + ePayload + "." + eSignature;
	}
	public String getJti() {
		return this.payload.getString("jti");
	}
	public List<String> getAud() {
		List<String> reps = new ArrayList<>();
		JsonArray aud =  this.payload.getJsonArray("aud");
		for(int i = 0, s = aud.size(); i < s; i++)
			reps.add(aud.getString(i));

		return reps;
	}
	public long getRid() {
		return this.payload.getJsonNumber("rid").longValue();
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

	private static boolean isToken(String authHeader) {
		return authHeader != null &&
			   authHeader.toLowerCase().startsWith(AUTH_SCHEME.toLowerCase() + " ") &&
			   authHeader.length() > (AUTH_SCHEME.length() + 1);
	}

	private static boolean isValidParts(String[] parts) {
		return parts != null &&
			   parts.length == 3 &&
			   parts[0] != null && !parts[0].isEmpty() &&
			   parts[1] != null && !parts[1].isEmpty() &&
			   parts[2] != null && !parts[2].isEmpty();
	}

}
