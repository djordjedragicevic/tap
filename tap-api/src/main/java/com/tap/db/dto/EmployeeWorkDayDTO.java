package com.tap.db.dto;

import java.time.LocalTime;

public record EmployeeWorkDayDTO(
		long getId,
		long getUserId,
		String getFirstName,
		String getLastName,
		String getUsername,
		byte getDay,
		LocalTime getStart,
		LocalTime getEnd,
		LocalTime getBreakStart,
		LocalTime getBreakEnd) {
}
