/**
 * Generated DTO class for "ServiceEmployee"
 */
package com.tap.rest.dto;
public class ServiceEmployeeDto {	
	private Integer id;
	private EmployeeDto employee; 
	private ServiceDto service; 
	public ServiceEmployeeDto() {}

	public ServiceEmployeeDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public EmployeeDto getEmployee() {
		return this.employee;
	}

	public ServiceEmployeeDto setEmployee(EmployeeDto employee) {
		this.employee = employee;
		return this;
	}
	public ServiceDto getService() {
		return this.service;
	}

	public ServiceEmployeeDto setService(ServiceDto service) {
		this.service = service;
		return this;
	}
}