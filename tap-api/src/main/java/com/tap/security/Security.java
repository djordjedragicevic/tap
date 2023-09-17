package com.tap.security;

import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;

public class Security {
	public static int getUserId(SecurityContext sC) {
		Principal p = sC.getUserPrincipal();
		if (p != null) {
			String id = p.getName();
			if (id != null && !id.isEmpty()) {
				return Integer.parseInt(id);
			}
		}

		return -1;
	}
}
