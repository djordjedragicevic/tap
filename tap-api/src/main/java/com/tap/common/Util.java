package com.tap.common;

import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import org.eclipse.microprofile.config.ConfigProvider;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.*;
import java.util.*;

public class Util {
	private static final String ZONE = "Europe/Sarajevo";

	private Util() {

	}

	public static LocalDateTime zonedNow() {
		return LocalDateTime.now(Util.zone());
	}

	public static ZoneId zone() {
		return ZoneId.of(ZONE);
	}

	public static LocalDateTime zonedDT(Date date) {
		return date.toInstant().atZone(Util.zone()).toLocalDateTime();
	}


	public static List<Map<String, Object>> convertToListOfMap(List<Object[]> data, String... keys) {
		return convertToListOfMap(data, Arrays.asList(keys));
	}
	public static List<Map<String, Object>> convertToListOfMap(List<Object[]> data, List<String> keys) {
		return convertToListOfMap(data, keys, null);
	}
	public static List<Map<String, Object>> convertToListOfMap(List<Object[]> data, List<String> keys, Set<String> escape) {
		return convertToListOfMap(data, keys.toArray(String[]::new), escape);
	}
	public static List<Map<String, Object>> convertToListOfMap(List<Object[]> data, String[] keys,String escape) {
		return convertToListOfMap(data,keys, Set.of(escape));
	}

	public static List<Map<String, Object>> convertToListOfMap(List<Object[]> data, String[] keys, Set<String> escape) {

		List<Map<String, Object>> listOfMap = new ArrayList<>();

		for (Object[] r : data)
			listOfMap.add(generateMapForConversion(r, keys, new LinkedHashMap<>(), escape));

		return listOfMap;
	}

	public static Map<String, Object> convertToMap(Object[] r, String... keys) {
		return generateMapForConversion(r, keys, new LinkedHashMap<>(), null);
	}
	public static Map<String, Object> convertToMap(Object[] r, Set<String> escape, String... keys) {
		return generateMapForConversion(r, keys, new LinkedHashMap<>(), escape);
	}
	public static Map<String, Object> convertToMap(Object[] r, String[] keys,String escape) {
		return generateMapForConversion(r, keys, new LinkedHashMap<>(), Set.of(escape));
	}


	private static Map<String, Object> generateMapForConversion(Object[] r, String[] keys, Map<String, Object> map, Set<String> escape) {

		if (r == null || r.length == 0)
			return map;

		String tmpK;
		Map<String, Object> tmpV;

//		List<Object> lK;
//		Object[] subR;
//		List<Object> subK;
		String[] keyPath;
		String key;
		String[] asSplit;

		for (int i = 0, s = keys.length; i < s; i++) {
			if (r[i] == null)
				continue;
			tmpK = keys[i];
			if (tmpK.contains(" AS ")) {
				asSplit = tmpK.split("AS");
				tmpK = asSplit[asSplit.length - 1].trim();
			}

//			if (tmpK instanceof List<?>) {
//				lK = (List<Object>) tmpK;
//				subR = Arrays.copyOfRange(r, i, i + lK.size() - 1);
//				subK = lK.subList(1, lK.size());
//				map.put(lK.get(0).toString(), generateMapForConversion(subR, subK.toArray(String[]::new), new LinkedHashMap<>(), escape));
//			}
//			else
			if (tmpK.contains(".")) {
				keyPath = tmpK.split("\\.");
				key = keyPath[keyPath.length - 1];

				tmpV = map;
				for (int kI = 0; kI < keyPath.length - 1; kI++) {
					if (escape != null && !escape.isEmpty() && escape.contains(keyPath[kI]))
						continue;
					tmpV = (Map<String, Object>) tmpV.computeIfAbsent(keyPath[kI], k -> new LinkedHashMap<String, Object>());
				}

				tmpV.put(key, r[i]);

			} else {
				map.put(tmpK, r[i]);
			}
		}

		return map;
	}

	public static boolean isMail(String mail) {
		try {
			InternetAddress email = new InternetAddress(mail);
			email.validate();
			return true;
		} catch (AddressException ignored) {
			return false;
		}
	}

	public static String getRandomString(int from, int to, int length) {
		Random random = new SecureRandom();
		byte[] bytes = new byte[length];
		for (int i = 0; i < length; i++) {
			int b = random.nextInt(33, 127);
			bytes[i] = (byte) b;
		}

		return new String(bytes, StandardCharsets.UTF_8);
	}

	public static String getRandomString(int length, boolean base64encoded) {
		return base64encoded ?
				Base64.getEncoder().encodeToString(getRandomBytes(length))
				:
				getRandomString(33, 127, length);
	}

	public static byte[] getRandomBytes(int length) {
		Random random = new SecureRandom();
		byte[] bytes = new byte[length];
		random.nextBytes(bytes);
		return bytes;
	}

	public static String generateVerificationCode() {

		int codeLength = ConfigProvider.getConfig().getValue("tap.verification.code.length", Integer.class);
		return Util.generateVerificationCode(codeLength);

	}

	public static String generateVerificationCode(int codeLength) {

		SecureRandom random = new SecureRandom();
		StringBuilder code = new StringBuilder();
		String numbers = "0123456789";

		for (int i = 0; i < codeLength; i++)
			code.append(numbers.charAt(random.nextInt(numbers.length())));

		return code.toString();

	}


}