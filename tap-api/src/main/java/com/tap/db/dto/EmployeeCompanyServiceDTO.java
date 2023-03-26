package com.tap.db.dto;

public class EmployeeCompanyServiceDTO {
	private long id;
	private long employeeId;
	private long companyServiceId;

	public long getId() {
		return id;
	}

	public EmployeeCompanyServiceDTO setId(long id) {
		this.id = id;
		return this;
	}

	public long getEmployeeId() {
		return employeeId;
	}

	public EmployeeCompanyServiceDTO setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
		return this;
	}

	public long getCompanyServiceId() {
		return companyServiceId;
	}

	public EmployeeCompanyServiceDTO setCompanyServiceId(long companyServiceId) {
		this.companyServiceId = companyServiceId;
		return this;
	}
}
