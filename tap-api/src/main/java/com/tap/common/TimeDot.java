package com.tap.common;

import java.time.LocalTime;

public class TimeDot {
	private LocalTime time;
	private TimePeriod timePeriod;
	private boolean isStart;

	public TimeDot(LocalTime time, TimePeriod timePeriod, boolean isStart) {
		this.time = time;
		this.timePeriod = timePeriod;
		this.isStart = isStart;
	}

	public LocalTime getTime() {
		return time;
	}

	public TimePeriod getTimePeriod() {
		return timePeriod;
	}
	public boolean isStart() {
		return this.isStart;
	}
}
