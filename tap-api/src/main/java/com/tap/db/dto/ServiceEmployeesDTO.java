package com.tap.db.dto;

import java.util.HashSet;
import java.util.Set;

public class ServiceEmployeesDTO {
	private long serviceId;
	private String serviceName;
	private int groupId;
	private String groupName;
	private Set<EmployeeDTO> employees;

	public ServiceEmployeesDTO(long serviceId, String serviceName) {
		this.serviceId = serviceId;
		this.serviceName = serviceName;
		this.employees = new HashSet<>();
	}

	public long getServiceId() {
		return serviceId;
	}

	public String getServiceName() {
		return serviceName;
	}

	public int getGroupId() {
		return groupId;
	}

	public String getGroupName() {
		return groupName;
	}

	public Set<EmployeeDTO> getEmployees() {
		return employees;
	}

	public ServiceEmployeesDTO setGroupId(int groupId) {
		this.groupId = groupId;
		return this;
	}

	public ServiceEmployeesDTO setGroupName(String groupName) {
		this.groupName = groupName;
		return this;
	}
}
