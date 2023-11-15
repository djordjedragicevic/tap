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
public class TAPExceptionMapper implements ExceptionMapper<Exception> {

	@Override
	public Response toResponse(final Exception ex) {

		System.err.println(ex);

		TAPException exception;
		if (ex instanceof TAPException e)
			exception = e;
		else if (ex.getCause() instanceof TAPException e)
			exception = e;
		else
			exception = new TAPException(ErrID.TAP_0);

		JsonObjectBuilder err = Json.createObjectBuilder();
		err.add("tapEID", exception.getTapEID().toString());

		if (exception.getMessage() != null)
			err.add("message", exception.getMessage());

		if (exception.getParams() != null) {
			JsonObjectBuilder errParams = Json.createObjectBuilder();

			for (Map.Entry<String, String> entry : exception.getParams().entrySet())
				errParams.add(entry.getKey(), entry.getValue());

			err.add("params", errParams.build());
		}

		return Response.status(Response.Status.BAD_REQUEST).entity(err.build()).build();
	}
}
