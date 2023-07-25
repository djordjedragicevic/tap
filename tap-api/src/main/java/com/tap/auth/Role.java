package com.tap.auth;

public enum Role {
	SUPER_ADMIN("SUPER_ADMIN"),
	ADMIN("ADMIN"),
	PROVIDER_OWNER("PROVIDER_OWNER"),
	EMPLOYEE("EMPLOYEE"),
	USER("USER");

	private String name;
	Role(String name) {
		this.name = name;
	}

	public String getName(){
		return this.name;
	}
}
