package com.tap.db.dto;

import com.tap.appointments.TimePeriod;
import java.time.LocalDate;
import java.util.*;

public class EmployeeDTO {
	private Long id;
	private UserDTO user;
	private List<EmployeeWorkDayDTO> workDays;
	private List<CalendarDayDTO> calendar;
	private List<TimePeriod> periods;
	private List<CompanyServiceDTO> lookingServices;
	private CompanyDTO company;
	private List<EmployeeCompanyServiceDTO> employeeServices;


	public void addTimePeriod(LocalDate d, TimePeriod tp) {
		if (this.calendar == null)
			this.calendar = new ArrayList<>();

		if (tp != null)
			this.getCalendarDay(d).getPeriods().add(tp);
		else
			this.getCalendarDay(d).setWorking(false);

	}

	public CalendarDayDTO getCalendarDay(LocalDate date) {
		if (this.calendar == null)
			this.calendar = new ArrayList<>();

		return this.calendar.stream()
				.filter(d -> d.getDate().isEqual(date))
				.findAny()
				.orElseGet(() -> {
					CalendarDayDTO cD = new CalendarDayDTO(date);
					this.calendar.add(cD);
					return cD;
				});
	}

	public Long getId() {
		return id;
	}

	public EmployeeDTO setId(Long id) {
		this.id = id;
		return this;
	}

	public UserDTO getUser() {
		return user;
	}

	public EmployeeDTO setUser(UserDTO user) {
		this.user = user;
		return this;
	}

	public List<EmployeeWorkDayDTO> getWorkDays() {
		return workDays;
	}

	public EmployeeDTO setWorkDays(List<EmployeeWorkDayDTO> workDays) {
		this.workDays = workDays;
		return this;
	}

	public List<CalendarDayDTO> getCalendar() {
		return calendar;
	}

	public EmployeeDTO setCalendar(List<CalendarDayDTO> calendar) {
		this.calendar = calendar;
		return this;
	}

	public List<TimePeriod> getPeriods() {
		return periods;
	}

	public EmployeeDTO setPeriods(List<TimePeriod> periods) {
		this.periods = periods;
		return this;
	}

	public List<CompanyServiceDTO> getLookingServices() {
		return lookingServices;
	}

	public EmployeeDTO setLookingServices(List<CompanyServiceDTO> lookingServices) {
		this.lookingServices = lookingServices;
		return this;
	}

	public CompanyDTO getCompany() {
		return company;
	}

	public EmployeeDTO setCompany(CompanyDTO company) {
		this.company = company;
		return this;
	}

	public List<EmployeeCompanyServiceDTO> getEmployeeServices() {
		return employeeServices;
	}

	public EmployeeDTO setEmployeeServices(List<EmployeeCompanyServiceDTO> employeeServices) {
		this.employeeServices = employeeServices;
		return this;
	}
}
