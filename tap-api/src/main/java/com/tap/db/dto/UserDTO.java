package com.tap.db.dto;

public class UserDTO {
	long id;
	String firstName;
	String lastName;
	String username;

	public long getId() {
		return id;
	}

	public UserDTO setId(long id) {
		this.id = id;
		return this;
	}

	public String getFirstName() {
		return firstName;
	}

	public UserDTO setFirstName(String firstName) {
		this.firstName = firstName;
		return this;
	}

	public String getLastName() {
		return lastName;
	}

	public UserDTO setLastName(String lastName) {
		this.lastName = lastName;
		return this;
	}

	public String getUsername() {
		return username;
	}

	public UserDTO setUsername(String username) {
		this.username = username;
		return this;
	}
}