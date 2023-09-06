package com.tap.common;

import java.time.LocalTime;

public class TypedTimePeriod extends TimePeriod {
	public static final String OPEN = "OPEN";
	public static final String CLOSE = "CLOSE";
	private String type;

	public TypedTimePeriod(LocalTime start, LocalTime end, String type) {
		super(start, end);
		this.type = type;
	}

	public TypedTimePeriod setType(String type) {
		this.type = type;
		return this;
	}

	public String getType() {
		return type;
	}

	public boolean isOpen() {
		return this.type.equals(OPEN);
	}
}
