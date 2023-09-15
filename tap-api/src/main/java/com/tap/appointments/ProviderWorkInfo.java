package com.tap.appointments;

import com.tap.common.NamedTimePeriod;
import com.tap.common.TimePeriod;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class ProviderWorkInfo {
	public static class Employee {
		private final int employeeId;
		private boolean isWorking;
		private final String email;
		private final List<TimePeriod> workPeriods;
		private final List<TimePeriod> breakPeriods;
		private final String firstName;
		private final String lastName;
		private List<NamedTimePeriod> timeline;
		private List<NamedTimePeriod> freePeriods;
		private int freeTimeSum;
		private int workTimeSum;

		public Employee(Integer eId, String email, String fName, String lName) {
			this.employeeId = eId;
			this.isWorking = false;
			this.workPeriods = new ArrayList<>();
			this.breakPeriods = new ArrayList<>();
			this.timeline = new ArrayList<>();
			this.email = email;
			this.firstName = fName;
			this.lastName = lName;
		}

		public int getEmployeeId() {
			return employeeId;
		}

		public boolean isWorking() {
			return isWorking;
		}

		public String getEmail() {
			return email;
		}

		public List<TimePeriod> getWorkPeriods() {
			return workPeriods;
		}

		public List<TimePeriod> getBreakPeriods() {
			return breakPeriods;
		}

		public String getFirstName() {
			return firstName;
		}

		public String getLastName() {
			return lastName;
		}

		public List<NamedTimePeriod> getTimeline() {
			return timeline;
		}

		public int getFreeTimeSum() {
			return freeTimeSum;
		}

		public int getWorkTimeSum() {
			return workTimeSum;
		}

		public Employee setWorking(boolean working) {
			isWorking = working;
			return this;
		}

		public Employee setFreeTimeSum(int freeTimeSum) {
			this.freeTimeSum = freeTimeSum;
			return this;
		}

		public Employee setWorkTimeSum(int workTimeSum) {
			this.workTimeSum = workTimeSum;
			return this;
		}

		public List<NamedTimePeriod> getFreePeriods() {
			return freePeriods;
		}

		public Employee setFreePeriods(List<NamedTimePeriod> freePeriods) {
			this.freePeriods = freePeriods;
			return this;
		}
	}

	private final int providerId;
	private String providerName;
	boolean isWorking;
	private final List<TimePeriod> workPeriods;
	private final List<TimePeriod> breakPeriods;
	private final LocalDate atDay;
	private final List<Employee> employees;

	public ProviderWorkInfo(int providerId, LocalDate date) {
		this.providerId = providerId;
		this.isWorking = false;
		this.atDay = date;
		this.employees = new ArrayList<>();
		this.breakPeriods = new ArrayList<>();
		this.workPeriods = new ArrayList<>();
	}

	public Employee getEmployeeById(int id) {
		for (Employee e : this.getEmployees())
			if (e.getEmployeeId() == id)
				return e;
		return null;
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

	public String getProviderName() {
		return providerName;
	}

	public ProviderWorkInfo setProviderName(String name) {
		this.providerName = name;
		return this;
	}
}
