package com.tap.appointments;

import java.time.LocalDateTime;

public record TimePeriod(LocalDateTime start, LocalDateTime end, String type, String subType) {
	public static final String FREE = "FREE";
	public static final String BUSY = "BUSY";
	public static final String BUSY_STANDARD = "STANDARD";
	public static final String BUSY_BREAK = "BREAK";

	public TimePeriod(LocalDateTime start, LocalDateTime end, String type) {
		this(start, end, type, null);
	}

	@Override
	public String toString() {
		return "TimePeriod{" +
			   "start=" + start +
			   ", end=" + end +
			   ", type='" + type + '\'' +
			   '}';
	}
}
