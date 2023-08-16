package com.tap.appointments;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class Utils {

	public static final String EVERY_DAY = "EVERY_DAY";
	public static final String EVERY_WEEK = "EVERY_WEEK";
	public static final String EVERY_MONT = "EVERY_MONTH";
	public static final String EVERY_YEAR = "EVERT_YEAR";
	public static final int DAYS_TO_GET = 3;
	public static final int FREE_APP_DAYS = 10;

	public static Optional<LocalDateTime> parseDT(String dt) {
		return Optional.ofNullable(dt != null && !dt.isEmpty() ? LocalDateTime.parse(dt, DateTimeFormatter.ISO_DATE_TIME) : null);
	}

	public static Optional<LocalDate> parseDate(String t) {
		return Optional.ofNullable(t != null && !t.isEmpty() ? LocalDate.parse(t, DateTimeFormatter.ISO_DATE) : null);
	}

	public static List<Long> parseIDs(String ids) {
		return Arrays.stream(ids.split(",")).map(Long::valueOf).toList();
	}
}
