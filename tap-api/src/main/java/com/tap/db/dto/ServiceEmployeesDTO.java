package com.tap.db.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ServiceEmployeesDTO {
	private long serviceId;
	private String serviceName;
	private int groupId;
	private String groupName;
	private List<EmployeeDTO> employees;
	private int duration;
	public List<Integer> employeeIds;

	public ServiceEmployeesDTO(long serviceId, String serviceName, int duration) {
		this.serviceId = serviceId;
		this.serviceName = serviceName;
		this.employees = new ArrayList<>();
		this.duration = duration;
		this.employeeIds = new ArrayList<>();
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

	public List<EmployeeDTO> getEmployees() {
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

	public int getDuration() {
		return duration;
	}

	public List<Integer> getEmployeeIds() {
		return employeeIds;
	}
}
