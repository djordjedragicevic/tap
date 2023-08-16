package com.tap.appointments;

import com.tap.common.TimePeriod;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ProviderWorkInfo {
	public static class Employee {
		private final int employeeId;
		boolean isWorking;
		private final String email;
		private final List<TimePeriod> workPeriods;
		private final List<TimePeriod> breakPeriods;

		public Employee(Integer eId, String email) {
			this.employeeId = eId;
			this.isWorking = false;
			this.workPeriods = new ArrayList<>();
			this.breakPeriods = new ArrayList<>();
			this.email = email;
		}

		public int getEmployeeId() {
			return employeeId;
		}

		public List<TimePeriod> getWorkPeriods() {
			return workPeriods;
		}

		public List<TimePeriod> getBreakPeriods() {
			return breakPeriods;
		}

		public boolean isWorking() {
			return isWorking;
		}

		public Employee setWorking(boolean working) {
			isWorking = working;
			return this;
		}

		public String getEmail() {
			return email;
		}
	}

	private final int providerId;
	private String name;
	boolean isWorking;
	private final List<TimePeriod> workPeriods;
	private final List<TimePeriod> breakPeriods;
	private final LocalDate atDay;
	private List<Employee> employees;

	public ProviderWorkInfo(int providerId, LocalDate date) {
		this.providerId = providerId;
		this.isWorking = false;
		this.atDay = date;
		this.employees = new ArrayList<>();
		this.breakPeriods = new ArrayList<>();
		this.workPeriods = new ArrayList<>();
	}

	public int getProviderId() {
		return providerId;
	}

	public List<TimePeriod> getWorkPeriods() {
		return workPeriods;
	}

	public List<TimePeriod> getBreakPeriods() {
		return breakPeriods;
	}

	public LocalDate getAtDay() {
		return atDay;
	}

	public boolean isWorking() {
		return isWorking;
	}

	public void setWorking(boolean working) {
		isWorking = working;
	}

	public List<Employee> getEmployees() {
		return employees;
	}

	public String getName() {
		return name;
	}

	public ProviderWorkInfo setName(String name) {
		this.name = name;
		return this;
	}
}
