package com.tap.security;

public class Credentials {
	private String username;
	private String password;

	public Credentials() {

	}

	public Credentials(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public String getUsername() {
		return username;
	}

	public Credentials setUsername(String userName) {
		this.username = userName;
		return this;
	}

	public String getPassword() {
		return password;
	}

	public Credentials setPassword(String password) {
		this.password = password;
		return this;
	}

	public boolean isValid() {
		return this.getPassword() != null && !this.getPassword().isEmpty() && this.getUsername() != null && !this.getUsername().isEmpty();
	}
}
