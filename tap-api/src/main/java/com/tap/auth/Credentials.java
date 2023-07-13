package com.tap.auth;

import java.io.Serializable;

public class Credentials implements Serializable {
	private String username;
	private String email;
	private String password;

	public Credentials() {

	}

	public String getUsername() {
		return username;
	}

	public Credentials setUsername(String username) {
		this.username = username;
		return this;
	}

	public String getEmail() {
		return email;
	}

	public Credentials setEmail(String email) {
		this.email = email;
		return this;
	}

	public String getPassword() {
		return password;
	}

	public Credentials setPassword(String password) {
		this.password = password;
		return this;
	}
}
