package com.tap.db.dto;

import java.util.List;

public class CompanyWorkInfoDTO {
	private Long id;
	private List<CompanyWorkDayDTO> workDays;
	private List<EmployeeDTO> employees;

	public CompanyWorkInfoDTO() {
	}

	public Long getId() {
		return id;
	}

	public CompanyWorkInfoDTO setId(Long id) {
		this.id = id;
		return this;
	}

	public List<CompanyWorkDayDTO> getWorkDays() {
		return workDays;
	}

	public CompanyWorkInfoDTO setWorkDays(List<CompanyWorkDayDTO> workDays) {
		this.workDays = workDays;
		return this;
	}

	public List<EmployeeDTO> getEmployees() {
		return employees;
	}

	public CompanyWorkInfoDTO setEmployees(List<EmployeeDTO> employees) {
		this.employees = employees;
		return this;
	}
}
