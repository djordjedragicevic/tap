package com.tap.exception;

import jakarta.ws.rs.WebApplicationException;

import java.util.Map;

public class TAPException extends WebApplicationException {
	private TAPEID tapEID;
	private String message;
	private Map<String, Object> params;

	public TAPException() {
		this(TAPEID.TAP_0);
	}

	public TAPException(TAPEID tapEID) {
		super();
		this.tapEID = tapEID;
	}

	public TAPException(TAPEID tapEID, String message) {
		super();
		this.tapEID = tapEID;
		this.message = message;
	}

	public TAPException(TAPEID tapEID, String message, Map<String, Object> params) {
		super();
		this.tapEID = tapEID;
		this.message = message;
		this.params = params;
	}

	public TAPEID getTapEID() {
		return tapEID;
	}

	@Override
	public String getMessage() {
		return message;
	}

	public Map<String, Object> getParams() {
		return params;
	}
}
