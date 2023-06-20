package com.tap.common;

import java.util.*;

public class Util {

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

	private static Map<String, Object> generateMapForConversion(Object[] r, List<Object> keys, Map<String, Object> map) {

		Object tmpK;
		for (int i = 0, s = keys.size(); i < s; i++) {
			tmpK = keys.get(i);
			if (tmpK instanceof List) {
				List<Object> lK = (List<Object>) tmpK;
				Object[] subR = Arrays.copyOfRange(r, i, i + lK.size() - 1);
				List<Object> subK = lK.subList(1, lK.size());
				map.put(lK.get(0).toString(), generateMapForConversion(subR, subK, new LinkedHashMap<>()));
			} else {
				map.put(tmpK.toString(), r[i]);
			}
		}

		return map;
	}
}