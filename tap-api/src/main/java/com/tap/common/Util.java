package com.tap.common;

import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.*;

public class Util {

	private static final Random random = new SecureRandom();

	private Util() {

	}

	public static List<Map<String, Object>> convertToListOfMap(List<Object[]> data, String... keys) {
		return convertToListOfMap(data, Arrays.asList(keys));
	}

	public static List<Map<String, Object>> convertToListOfMap(List<Object[]> data, List<Object> keys) {

		List<Map<String, Object>> listOfMap = new ArrayList<>();

		for (Object[] r : data)
			listOfMap.add(generateMapForConversion(r, keys, new LinkedHashMap<>()));

		return listOfMap;
	}

	public static Map<String, Object> convertToMap(Object[] r, String... keys) {
		return generateMapForConversion(r, Arrays.asList(keys), new LinkedHashMap<>());
	}

	private static Map<String, Object> generateMapForConversion(Object[] r, List<Object> keys, Map<String, Object> map) {

		if (r == null || r.length == 0)
			return map;

		Object tmpK;
		Map<String, Object> tmpV;
		for (int i = 0, s = keys.size(); i < s; i++) {
			tmpK = keys.get(i);

			if (tmpK instanceof List<?>) {
				List<Object> lK = (List<Object>) tmpK;
				Object[] subR = Arrays.copyOfRange(r, i, i + lK.size() - 1);
				List<Object> subK = lK.subList(1, lK.size());
				map.put(lK.get(0).toString(), generateMapForConversion(subR, subK, new LinkedHashMap<>()));
			} else if (tmpK.toString().contains(".")) {
				String[] keyPath = tmpK.toString().split("\\.");
				String key = keyPath[keyPath.length - 1];

				tmpV = map;
				for (int kI = 0; kI < keyPath.length - 1; kI++)
					tmpV = (Map<String, Object>) tmpV.computeIfAbsent(keyPath[kI], k -> new LinkedHashMap<String, Object>());

				tmpV.put(key, r[i]);

			} else {
				map.put(tmpK.toString(), r[i]);
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


	public static String getRandomString(byte from, byte to, int length) {
		byte[] bytes = new byte[length];
		for (int i = 0; i < length; i++) {
			int b = random.nextInt(from, to + 1);
			bytes[i] = (byte) b;
		}

		return new String(bytes, StandardCharsets.UTF_8);
	}

}