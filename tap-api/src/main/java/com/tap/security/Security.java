package com.tap.security;

import jakarta.ws.rs.core.SecurityContext;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.Principal;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

public class Security {
	public static int getUserId(SecurityContext sC) {
		Principal p = sC.getUserPrincipal();
		if (p != null) {
			String id = p.getName();
			if (id != null && !id.isEmpty()) {
				if (id.contains("_"))
					return Integer.parseInt(id.split("_")[0]);
				else
					return Integer.parseInt(id);
			}
		}

		return -1;
	}

	public static long getProviderId(SecurityContext sC) {
		Principal p = sC.getUserPrincipal();
		if (p != null) {
			String id = p.getName();
			if (id != null && !id.isEmpty()) {
				if (id.contains("_"))
					return Integer.parseInt(id.split("_")[1]);
				else
					return -1;
			}
		}

		return -1;
	}

	public static long getEmployeeId(SecurityContext sC) {
		Principal p = sC.getUserPrincipal();
		if (p != null) {
			String id = p.getName();
			if (id != null && !id.isEmpty()) {
				if (id.contains("_"))
					return Integer.parseInt(id.split("_")[2]);
				else
					return -1;
			}
		}

		return -1;
	}

	public static String encryptPassword(String password, String salt) throws InvalidKeySpecException, NoSuchAlgorithmException {

		String algorithm = "PBKDF2WithHmacSHA1";
		int derivedKeyLength = 8 * 32; // for SHA1
		int iterations = 20000; // NIST specifies 10000

		byte[] saltBytes = Base64.getDecoder().decode(salt);
		KeySpec spec = new PBEKeySpec(password.toCharArray(), saltBytes, iterations, derivedKeyLength);
		SecretKeyFactory f = SecretKeyFactory.getInstance(algorithm);

		byte[] encBytes = f.generateSecret(spec).getEncoded();
		return Base64.getEncoder().encodeToString(encBytes);
	}

}
