package com.tap.common;

import java.time.LocalTime;

public class TimeDot {
	private LocalTime time;
	private boolean isStart;
	private boolean isOpen;

	public TimeDot(LocalTime time, boolean isStart, boolean isOpen) {
		this.time = time;
		this.isStart = isStart;
		this.isOpen = isOpen;
	}

	public LocalTime getTime() {
		return time;
	}

	public boolean isStart() {
		return isStart;
	}

	public boolean isOpen() {
		return isOpen;
	}
}
