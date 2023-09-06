package com.tap.common;

import java.time.LocalTime;

public class NamedTimePeriod extends TypedTimePeriod {
	public static final String OPEN_FREE_TIME = "OPEN_FREE_TIME";
	public static final String CLOSE_P_BREAK = "CLOSE_P_BREAK";
	public static final String CLOSE_E_BREAK = "CLOSE_E_BREAK";
	public static final String OPEN_P_WORK = "OPEN_P_WORK";
	public static final String OPEN_E_WORK = "OPEN_E_WORK";
	public static final String CLOSE_P_BUSY = "CLOSE_P_BUSY";
	public static final String CLOSE_E_BUSY = "CLOSE_E_BUSY";
	public static final String CLOSE_APPOINTMENT = "CLOSE_APPOINTMENT";
	private String name;

	public NamedTimePeriod(LocalTime start, LocalTime end, String type, String name) {
		super(start, end, type);
		this.name = name;
	}

	public String getName() {
		return name;
	}
}
