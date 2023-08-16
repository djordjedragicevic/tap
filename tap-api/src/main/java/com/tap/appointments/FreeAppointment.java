package com.tap.appointments;

import com.tap.db.dto.EmployeeDTO;

import java.time.LocalDateTime;

public class FreeAppointment extends TimePeriodOld {

	private EmployeeDTO employee;
	public FreeAppointment(LocalDateTime start, LocalDateTime end, EmployeeDTO employee) {
		super(start, end, TimePeriodOld.FREE, TimePeriodOld.FREE_APPOINTMENT);
		this.employee = employee;
	}

	public EmployeeDTO getEmployee() {
		return employee;
	}
}
