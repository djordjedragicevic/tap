package com.tap.common;

import java.time.LocalTime;

public class TimeDot {
	public static final short OPEN = 1;
	public static final short CLOSE = 2;
	private LocalTime time;
	private short type;

	public TimeDot(LocalTime time, short type) {
		this.time = time;
		this.type = type;
	}

	public LocalTime getTime() {
		return time;
	}

	public TimeDot setTime(LocalTime time) {
		this.time = time;
		return this;
	}

	public short getType() {
		return type;
	}

	public TimeDot setType(short type) {
		this.type = type;
		return this;
	}
}
