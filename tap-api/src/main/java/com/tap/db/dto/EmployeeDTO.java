package com.tap.db.dto;

public class EmployeeDTO {
	private long id;
	private String firstName;
	private String lastName;

	public EmployeeDTO(long id, String firstName, String lastName) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
	}

	public long getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	@Override
	public boolean equals(Object obj) {
		if (obj instanceof EmployeeDTO e)
			return e.getId() == this.id;

		return false;
	}

	@Override
	public int hashCode() {
		return  (int)this.id;
	}

}
