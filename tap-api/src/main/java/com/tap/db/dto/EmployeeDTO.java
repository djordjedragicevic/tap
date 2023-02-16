package com.tap.db.dto;

import com.tap.appointments.TimePeriod;

import java.time.LocalDate;
import java.util.*;

public class EmployeeDTO {
	private long id;
	private UserDTO user;
	private List<EmployeeWorkDayDTO> workDays;
	private Map<LocalDate, List<TimePeriod>> calendar;

	public long getId() {
		return id;
	}

	public EmployeeDTO setId(long id) {
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

	public void addWorkDay(EmployeeWorkDayDTO workDay) {
		if (this.workDays == null)
			this.workDays = new ArrayList<>();
		this.workDays.add(workDay);
	}

	public Map<LocalDate, List<TimePeriod>> getCalendar() {
		return calendar;
	}

	public EmployeeDTO setCalendar(Map<LocalDate, List<TimePeriod>> calendar) {
		this.calendar = calendar;
		return this;
	}

	public EmployeeDTO addTimePeriod(LocalDate d, TimePeriod tp) {
		if(this.calendar == null)
			this.calendar = new LinkedHashMap<>();
		this.calendar.computeIfAbsent(d, k -> new ArrayList<>()).add(tp);
		return this;
	}
}
