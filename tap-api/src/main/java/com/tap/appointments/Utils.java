package com.tap.appointments;

import com.tap.common.TimePeriod;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

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

	public static boolean isTimeOverlap(TimePeriod time, TimePeriod target) {
		return (time.getStart().isAfter(target.getStart()) && time.getStart().isBefore(target.getEnd()))
			   ||
			   (time.getEnd().isAfter(target.getStart()) && time.getEnd().isBefore(target.getEnd()))
			   ||
			   (time.getStart().isBefore(target.getStart()) && time.getEnd().isAfter(target.getEnd()));
	}

	public static TimePeriod adjustOverlapTime(TimePeriod time, TimePeriod target) {
		LocalTime newStart = time.getStart().isBefore(target.getStart()) ? target.getStart() : time.getStart();
		LocalTime newEnd = time.getEnd().isAfter(target.getEnd()) ? target.getEnd() : time.getEnd();
		return new TimePeriod(newStart, newEnd);
	}

	public static LocalTime roundUpTo5Min(LocalTime time) {
		int m = time.getMinute();
		while (m % 5 != 0)
			m += 1;
		return LocalTime.of(time.getHour(), m);
	}

	public static LocalTime getEarliestStartTime(Collection<List<TimePeriod>> times) {
		return times.stream()
				.map(t -> t.get(0))
				.sorted(Comparator.comparing(TimePeriod::getStart))
				.toList()
				.get(0)
				.getStart();
	}

	public static LocalTime getLatestEndTime(Collection<List<TimePeriod>> times) {
		List<TimePeriod> tP = times.stream()
				.map(t -> t.get(0))
				.sorted(Comparator.comparing(TimePeriod::getEnd))
				.toList();
		return tP.get(tP.size() - 1).getEnd();
	}
}
