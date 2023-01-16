package com.tap.db.dto;

import java.time.LocalTime;

public record EmployeeWorkDayDTO(
		long id,
		long userId,
		String firstName,
		String lastName,
		String username,
		byte day,
		LocalTime start,
		LocalTime end,
		LocalTime breakStart,
		LocalTime breakEnd) {
}
