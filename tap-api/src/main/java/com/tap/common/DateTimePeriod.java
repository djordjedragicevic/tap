package com.tap.common;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class DateTimePeriod {
	private LocalDateTime start;
	private LocalDateTime end;

	public DateTimePeriod(LocalDate startDate, LocalTime startTime, LocalDate endDate, LocalTime endTime) {
		this.start = LocalDateTime.of(startDate, startTime);
		this.end = LocalDateTime.of(endDate, endTime);
	}

	public LocalDateTime getStart() {
		return start;
	}

	public DateTimePeriod setStart(LocalDateTime start) {
		this.start = start;
		return this;
	}

	public LocalDateTime getEnd() {
		return end;
	}

	public DateTimePeriod setEnd(LocalDateTime end) {
		this.end = end;
		return this;
	}
}
