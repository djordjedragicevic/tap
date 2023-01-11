package com.tap.db.dto;

import java.util.ArrayList;
import java.util.List;

public class EmployeeDTO {
	private Long id;
	private String firstName;
	private String lastName;
	private List<EmployeeWorkDay> workingHours;

	public EmployeeDTO(Long id, String firstName, String lastName) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.workingHours = new ArrayList<>();
	}

	public Long getId() {
		return id;
	}

	public EmployeeDTO setId(Long id) {
		this.id = id;
		return this;
	}

	public String getFirstName() {
		return firstName;
	}

	public EmployeeDTO setFirstName(String firstName) {
		this.firstName = firstName;
		return this;
	}

	public String getLastName() {
		return lastName;
	}

	public EmployeeDTO setLastName(String lastName) {
		this.lastName = lastName;
		return this;
	}

	public List<EmployeeWorkDay> getWorkingHours() {
		return workingHours;
	}

	public EmployeeDTO setWorkingHours(List<EmployeeWorkDay> workingHours) {
		this.workingHours = workingHours;
		return this;
	}
}
