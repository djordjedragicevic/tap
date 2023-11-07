package com.tap.common;

import java.time.LocalTime;

public class NamedTimePeriodExt extends NamedTimePeriod {
	private Object data;

	public NamedTimePeriodExt(LocalTime start, LocalTime end, String type, String name) {
		super(start, end, type, name);
	}

	public NamedTimePeriodExt(LocalTime start, LocalTime end, String type, String name, Object data) {
		super(start, end, type, name);
		this.data = data;
	}

	public Object getData() {
		return data;
	}

	public NamedTimePeriodExt setData(Object data) {
		this.data = data;
		return this;
	}
}
