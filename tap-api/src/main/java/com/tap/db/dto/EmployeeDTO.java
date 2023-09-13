package com.tap.db.dto;

import java.util.Objects;

public class EmployeeDTO {
	private int id;
	private String firstName;
	private String lastName;

	public EmployeeDTO(int id, String firstName, String lastName) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
	}

	public int getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof EmployeeDTO that)) return false;
		return getId() == that.getId();
	}

	@Override
	public int hashCode() {
		return Objects.hash(getId(), getFirstName(), getLastName());
	}
}
