package com.tap.common;

import jakarta.json.bind.annotation.JsonbDateFormat;

import java.time.LocalTime;

public class TimePeriod {
	@JsonbDateFormat("HH:mm")
	private final LocalTime start;
	@JsonbDateFormat("HH:mm")
	private final LocalTime end;

	public TimePeriod(LocalTime start, LocalTime end) {
		this.start = start;
		this.end = end;
	}


	public LocalTime getStart() {
		return start;
	}

	public LocalTime getEnd() {
		return end;
	}

}
