package com.tap.rest;

import java.util.Map;

public class TAPResponse {
	public static Map<String, Object> get(Object data) {
		return Map.of("data", data);
	}
}
