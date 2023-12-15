package com.tap.appointments;

import com.tap.rest.dto.EmployeeDto;
import com.tap.rest.dto.ServiceDto;
import jakarta.json.bind.annotation.JsonbDateFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class FreeAppointment {

	public static class Service {
		private LocalTime time;
		private String joinId;
		private ServiceDto service;
		private EmployeeDto employee;

		public Service() {
		}

		public Service(LocalTime time, ServiceDto service, EmployeeDto employee) {
			this.time = time;
			this.service = service;
			this.employee = employee;
		}

		@JsonbDateFormat(value = "HH:mm")
		public LocalTime getTime() {
			return time;
		}

		public Service setTime(LocalTime time) {
			this.time = time;
			return this;
		}

		public String getJoinId() {
			return joinId;
		}

		public Service setJoinId(String joinId) {
			this.joinId = joinId;
			return this;
		}

		public ServiceDto getService() {
			return service;
		}

		public Service setService(ServiceDto service) {
			this.service = service;
			return this;
		}

		public EmployeeDto getEmployee() {
			return employee;
		}

		public Service setEmployee(EmployeeDto employee) {
			this.employee = employee;
			return this;
		}
	}

	private String id;

	private int providerId;
	private int durationSum;
	private LocalDate date;
	private List<Service> services = new ArrayList<>();

	public FreeAppointment finalize(String id, Integer pId, LocalDate date) {
		this.id = id;
		this.getServices().forEach(s -> s.joinId = id);
		this.providerId = pId;
		this.date = date;
		return this;
	}

	public String getId() {
		return id;
	}

	public FreeAppointment setId(String id) {
		this.id = id;
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

	public LocalDate getDate() {
		return date;
	}

	public FreeAppointment setDate(LocalDate date) {
		this.date = date;
		return this;
	}

	public int getProviderId() {
		return providerId;
	}

	public FreeAppointment setProviderId(int providerId) {
		this.providerId = providerId;
		return this;
	}
}
