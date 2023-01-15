package com.tap.common;

import java.time.LocalDateTime;
import java.time.LocalTime;

public record TimePeriod(LocalDateTime start, LocalDateTime end, String type) {
	public final static String TYPE_FREE = "FREE";
	public final static String TYPE_BUSY = "BUSY";
}
