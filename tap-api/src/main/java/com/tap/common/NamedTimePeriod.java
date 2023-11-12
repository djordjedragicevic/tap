package com.tap.common;

import java.time.LocalTime;

public class NamedTimePeriod extends TypedTimePeriod {
	public static final String OPEN_PROVIDER_WORK = "OPEN_PROVIDER_WORK";
	public static final String OPEN_EMPLOYEE_WORK = "OPEN_EMPLOYEE_WORK";
	public static final String CLOSE_PROVIDER_BREAK = "CLOSE_PROVIDER_BREAK";
	public static final String CLOSE_EMPLOYEE_BREAK = "CLOSE_EMPLOYEE_BREAK";

	public static final String OPEN_FREE_TIME = "OPEN_FREE_TIME";
	public static final String CLOSE_PROVIDER_BUSY = "CLOSE_PROVIDER_BUSY";
	public static final String CLOSE_EMPLOYEE_BUSY = "CLOSE_EMPLOYEE_BUSY";
	public static final String CLOSE_APPOINTMENT = "CLOSE_APPOINTMENT";
	private final String name;

	public NamedTimePeriod(LocalTime start, LocalTime end, String type, String name) {
		super(start, end, type);
		this.name = name;
	}

	public String getName() {
		return name;
	}
}
