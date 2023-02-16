package com.tap.appointments;

import java.time.LocalDateTime;

public record TimePeriod(LocalDateTime getStart, LocalDateTime getEnd, String getType, String getSubType) {
	public static final String FREE = "FREE";
	public static final String BUSY = "BUSY";
	public static final String FREE_APPOINTMENT = "FREE_APPOINTMENT";
	public static final String FREE_PERIOD = "FREE_PERIOD";
	public static final String BUSY_APPOINTMENT = "BUSY_APPOINTMENT";
	public static final String BUSY_BREAK = "BUSY_BREAK";
	public static final String FREE_WORK_HOURS = "FREE_WORK_HOURS";
}
