package com.tap;

import java.util.Map;

public class TAPResponse {

	private TAPResponse(){
	}

	public static Map<String, Object> wrap(Object data) {
		return Map.of("data", data);
	}
}
