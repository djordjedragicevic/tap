package com.tap.common;

import java.time.LocalTime;

public class TimePeriod {
	public static final String OPEN = "OPEN";
	public static final String CLOSE = "CLOSE";
	private LocalTime start;
	private LocalTime end;
	private String type;
	private String name;

	public TimePeriod(LocalTime start, LocalTime end) {
		this.start = start;
		this.end = end;
	}

	public TimePeriod(LocalTime start, LocalTime end, String type) {
		this(start, end);
		this.type = type;
	}

	public TimePeriod(LocalTime start, LocalTime end, String type, String name) {
		this(start, end, type);
		this.name = name;
	}

	public static TimePeriod open(LocalTime start, LocalTime end){
		return new TimePeriod(start, end, TimePeriod.CLOSE);
	}
	public static TimePeriod close(LocalTime start, LocalTime end){
		return new TimePeriod(start, end, TimePeriod.OPEN);
	}

	public LocalTime getStart() {
		return start;
	}

	public TimePeriod setStart(LocalTime start) {
		this.start = start;
		return this;
	}

	public LocalTime getEnd() {
		return end;
	}

	public TimePeriod setEnd(LocalTime end) {
		this.end = end;
		return this;
	}

	public String getType() {
		return type;
	}

	public TimePeriod setType(String type) {
		this.type = type;
		return this;
	}

	public String getName() {
		return name;
	}

	public TimePeriod setName(String name) {
		this.name = name;
		return this;
	}
}
