package com.tap.auth;

import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@RequestScoped
@Path("auth")
public class UserAuth {

	@Path("check-token")
	@POST
	public Response checkToken(@FormParam("token") String token){
		return Response.ok(doCheckToken(token)).build();
	}

	private  boolean doCheckToken (String token){
		return token != null && !token.isEmpty();
	}
}
