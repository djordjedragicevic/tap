package com.tap.appointments;

import com.tap.db.dto.EmployeeDTO;

import java.time.LocalDateTime;

public class FreeAppointment extends TimePeriod {

	private EmployeeDTO employee;
	public FreeAppointment(LocalDateTime start, LocalDateTime end, EmployeeDTO employee) {
		super(start, end, TimePeriod.FREE, TimePeriod.FREE_APPOINTMENT);
		this.employee = employee;
	}

	public EmployeeDTO getEmployee() {
		return employee;
	}
}
