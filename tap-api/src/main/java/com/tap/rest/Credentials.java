package com.tap.rest;

public class Credentials {
	private String userName;
	private String password;

	public Credentials() {

	}

	public Credentials(String userName, String password) {
		this.userName = userName;
		this.password = password;
	}

	public String getUserName() {
		return userName;
	}

	public Credentials setUserName(String userName) {
		this.userName = userName;
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
