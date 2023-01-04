package com.tap;

import java.util.Map;

public class TAPResponse {

	private TAPResponse(){
	}

	public static Map<String, Object> wrap(Object data) {
		return Map.of("data", data);
	}

	public static Map<String, Object> wrap(Object data, Map<String, Object> extra) {
		return Map.of("data", data, "extra", extra);
	}
}
