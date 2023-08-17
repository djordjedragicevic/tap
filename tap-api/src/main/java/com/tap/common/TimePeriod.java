package com.tap.common;

import java.time.LocalTime;

public class TimePeriod {
	public static final String OPEN = "OPEN";
	public static final String CLOSE = "CLOSE";
	private LocalTime start;
	private LocalTime end;
	private String type;

	public TimePeriod(LocalTime start, LocalTime end) {
		this.start = start;
		this.end = end;
	}

	public TimePeriod(LocalTime start, LocalTime end, String type) {
		this(start, end);
		this.type = type;
	}

	public static TimePeriod open(LocalTime start, LocalTime end) {
		return new TimePeriod(start, end, TimePeriod.CLOSE);
	}

	public static TimePeriod close(LocalTime start, LocalTime end) {
		return new TimePeriod(start, end, TimePeriod.OPEN);
	}

	public LocalTime getStart() {
		return start;
	}

	public LocalTime getEnd() {
		return end;
	}

	public String getType() {
		return type;
	}

	public boolean isOpen() {
		return this.type.equals(TimePeriod.OPEN);
	}

}
