package com.tap.auth;

import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;

public class TAPSecurityContext implements SecurityContext {

	private int userId;

	public TAPSecurityContext(int userId) {
		this.userId = userId;
	}

	@Override
	public Principal getUserPrincipal() {
		return () -> String.valueOf(this.userId);
	}

	@Override
	public boolean isUserInRole(String role) {
		return true;
	}

	@Override
	public boolean isSecure() {
		return true;
	}

	@Override
	public String getAuthenticationScheme() {
		return null;
	}
}
