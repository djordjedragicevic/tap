package com.tap.appointments;

import com.tap.db.dto.EmployeeDTO;
import com.tap.db.dto.ServiceDTO;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class FreeAppointment {

	public static class Service {
		private LocalTime time;
		private String joinId;
		private ServiceDTO service;
		private EmployeeDTO employee;

		public Service(LocalTime time, ServiceDTO service, EmployeeDTO employee) {
			this.time = time;
			this.service = service;
			this.employee = employee;
		}

		public LocalTime getTime() {
			return time;
		}

		public String getJoinId() {
			return joinId;
		}

		public ServiceDTO getService() {
			return service;
		}

		public EmployeeDTO getEmployee() {
			return employee;
		}
	}

	private String id;
	private String startAt;
	private int durationSum;
	private List<Service> services = new ArrayList<>();

	public String getId() {
		return id;
	}

	public FreeAppointment finalize(String id) {
		this.id = id;
		this.getServices().forEach(s -> s.joinId = id);
		return this;
	}

	public String getStartAt() {
		return startAt;
	}

	public FreeAppointment setStartAt(LocalTime startAt) {
		this.startAt = startAt.format(DateTimeFormatter.ofPattern("HH:mm"));
		return this;
	}

	public int getDurationSum() {
		return durationSum;
	}

	public FreeAppointment setDurationSum(int durationSum) {
		this.durationSum = durationSum;
		return this;
	}

	public List<Service> getServices() {
		return services;
	}

	public FreeAppointment setServices(List<Service> services) {
		this.services = services;
		return this;
	}
}
