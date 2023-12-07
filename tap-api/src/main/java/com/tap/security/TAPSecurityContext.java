package com.tap.security;

import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;
import java.util.List;

public class TAPSecurityContext implements SecurityContext {

	private final int userId;
	private final List<String> roles;
	private final Token token;

	public TAPSecurityContext(int userId, List<String> roles, Token t) {
		this.userId = userId;
		this.roles = roles;
		this.token = t;

	}

	@Override
	public Principal getUserPrincipal() {
		String name = String.valueOf(this.userId);
		if (this.token.getProviderId() > 0)
			name += ("_" + this.token.getProviderId() + "_" + this.token.getEmployeeId());

		String finalName = name;
		return () -> finalName;
	}

	@Override
	public boolean isUserInRole(String role) {
		return this.roles.contains(role);
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
