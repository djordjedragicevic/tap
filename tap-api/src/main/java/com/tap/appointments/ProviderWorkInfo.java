package com.tap.appointments;

import com.tap.common.NamedTimePeriod;
import com.tap.common.TimePeriod;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ProviderWorkInfo {
	public static class Employee {
		private final Integer employeeId;
		private Boolean isWorking;
		private String email;
		private List<TimePeriod> workPeriods;
		private List<TimePeriod> breakPeriods;
		private String name;
		private String firstName;
		private String lastName;
		private String imagePath;
		private List<NamedTimePeriod> timeline;
		private List<NamedTimePeriod> freePeriods;
		private Integer freeTimeSum;
		private Integer workTimeSum;

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

		public Employee(Integer employeeId) {
			this.employeeId = employeeId;
		}

		public Integer getEmployeeId() {
			return employeeId;
		}

		public Boolean getWorking() {
			return isWorking;
		}

		public Employee setWorking(Boolean working) {
			isWorking = working;
			return this;
		}

		public String getEmail() {
			return email;
		}

		public Employee setEmail(String email) {
			this.email = email;
			return this;
		}

		public List<TimePeriod> getWorkPeriods() {
			return workPeriods;
		}

		public Employee setWorkPeriods(List<TimePeriod> workPeriods) {
			this.workPeriods = workPeriods;
			return this;
		}

		public List<TimePeriod> getBreakPeriods() {
			return breakPeriods;
		}

		public Employee setBreakPeriods(List<TimePeriod> breakPeriods) {
			this.breakPeriods = breakPeriods;
			return this;
		}

		public String getName() {
			return name;
		}

		public Employee setName(String name) {
			this.name = name;
			return this;
		}

		public String getFirstName() {
			return firstName;
		}

		public Employee setFirstName(String firstName) {
			this.firstName = firstName;
			return this;
		}

		public String getLastName() {
			return lastName;
		}

		public Employee setLastName(String lastName) {
			this.lastName = lastName;
			return this;
		}

		public String getImagePath() {
			return imagePath;
		}

		public Employee setImagePath(String imagePath) {
			this.imagePath = imagePath;
			return this;
		}

		public List<NamedTimePeriod> getTimeline() {
			return timeline;
		}

		public Employee setTimeline(List<NamedTimePeriod> timeline) {
			this.timeline = timeline;
			return this;
		}

		public List<NamedTimePeriod> getFreePeriods() {
			return freePeriods;
		}

		public Employee setFreePeriods(List<NamedTimePeriod> freePeriods) {
			this.freePeriods = freePeriods;
			return this;
		}

		public Integer getFreeTimeSum() {
			return freeTimeSum;
		}

		public Employee setFreeTimeSum(Integer freeTimeSum) {
			this.freeTimeSum = freeTimeSum;
			return this;
		}

		public Integer getWorkTimeSum() {
			return workTimeSum;
		}

		public Employee setWorkTimeSum(Integer workTimeSum) {
			this.workTimeSum = workTimeSum;
			return this;
		}
	}

	private final Integer providerId;
	private String providerName;
	private String providerType;
	private String providerAddress;
	private String providerCity;
	private Boolean isWorking;
	private List<TimePeriod> workPeriods;
	private List<TimePeriod> breakPeriods;
	private LocalDate atDay;
	private List<Employee> employees;

	public ProviderWorkInfo(Integer providerId, LocalDate date) {
		this.providerId = providerId;
		this.isWorking = false;
		this.atDay = date;
		this.employees = new ArrayList<>();
		this.breakPeriods = new ArrayList<>();
		this.workPeriods = new ArrayList<>();
	}

	public ProviderWorkInfo(Integer providerId) {
		this.providerId = providerId;
	}

	public Employee getEmployeeById(Integer id) {
		for (Employee e : this.getEmployees())
			if (e.getEmployeeId().equals(id))
				return e;
		return null;
	}

	public Integer getProviderId() {
		return providerId;
	}

	public String getProviderName() {
		return providerName;
	}

	public ProviderWorkInfo setProviderName(String providerName) {
		this.providerName = providerName;
		return this;
	}

	public String getProviderType() {
		return providerType;
	}

	public ProviderWorkInfo setProviderType(String providerType) {
		this.providerType = providerType;
		return this;
	}

	public String getProviderAddress() {
		return providerAddress;
	}

	public ProviderWorkInfo setProviderAddress(String providerAddress) {
		this.providerAddress = providerAddress;
		return this;
	}

	public String getProviderCity() {
		return providerCity;
	}

	public ProviderWorkInfo setProviderCity(String providerCity) {
		this.providerCity = providerCity;
		return this;
	}

	public Boolean getWorking() {
		return isWorking;
	}

	public ProviderWorkInfo setWorking(Boolean working) {
		isWorking = working;
		return this;
	}

	public List<TimePeriod> getWorkPeriods() {
		return workPeriods;
	}

	public ProviderWorkInfo setWorkPeriods(List<TimePeriod> workPeriods) {
		this.workPeriods = workPeriods;
		return this;
	}

	public List<TimePeriod> getBreakPeriods() {
		return breakPeriods;
	}

	public ProviderWorkInfo setBreakPeriods(List<TimePeriod> breakPeriods) {
		this.breakPeriods = breakPeriods;
		return this;
	}

	public LocalDate getAtDay() {
		return atDay;
	}

	public ProviderWorkInfo setAtDay(LocalDate atDay) {
		this.atDay = atDay;
		return this;
	}

	public List<Employee> getEmployees() {
		return employees;
	}

	public ProviderWorkInfo setEmployees(List<Employee> employees) {
		this.employees = employees;
		return this;
	}
}
