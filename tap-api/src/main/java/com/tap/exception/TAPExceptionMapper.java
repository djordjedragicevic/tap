package com.tap.exception;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.bind.JsonbBuilder;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.LinkedHashMap;
import java.util.Map;

@Provider
public class TAPExceptionMapper implements ExceptionMapper<TAPException> {

	@Override
	public Response toResponse(final TAPException exception) {

		Map<String, Object> err = new LinkedHashMap<>();
		err.put("tapEID", exception.getTapEID().toString());
		if(exception.getMessage() != null)
			err.put("message", exception.getMessage());
		if(exception.getParams() != null)
			err.put("params", exception.getParams());

		return Response.serverError().status(Response.Status.BAD_REQUEST).entity(err).build();

	}
}
