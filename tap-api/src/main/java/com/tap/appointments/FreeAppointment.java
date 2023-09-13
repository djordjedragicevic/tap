package com.tap.appointments;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class FreeAppointment {

	public static class Service {
		private int serviceId;
		private String serviceName;
		private int employeeId;
		private LocalTime time;
		private int duration;

		public Service(int serviceId, String serviceName, int employeeId, LocalTime time, int duration) {
			this.serviceId = serviceId;
			this.serviceName = serviceName;
			this.employeeId = employeeId;
			this.time = time;
			this.duration = duration;
		}

		public int getServiceId() {
			return serviceId;
		}

		public String getServiceName() {
			return serviceName;
		}

		public int getEmployeeId() {
			return employeeId;
		}

		public LocalTime getTime() {
			return time;
		}

		public int getDuration() {
			return duration;
		}
	}

	private LocalTime startAt;
	private int durationSum;
	private List<Service> services = new ArrayList<>();
	public LocalTime getStartAt() {
		return startAt;
	}

	public FreeAppointment setStartAt(LocalTime startAt) {
		this.startAt = startAt;
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
