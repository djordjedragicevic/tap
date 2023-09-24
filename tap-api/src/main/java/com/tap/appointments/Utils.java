package com.tap.appointments;

import com.tap.common.TimePeriod;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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

	public static Optional<LocalDate> parseDate(Date d) {
		return Optional.ofNullable(d != null ? LocalDate.ofInstant(Instant.ofEpochMilli(d.getTime()), ZoneId.systemDefault()) : null);
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

	public static Optional<TimePeriod> findCoverTime(List<TimePeriod> timePeriods, TimePeriod target) {
		return timePeriods
				.stream()
				.filter(tP -> tP.getStart().isBefore(target.getStart()) && tP.getEnd().isAfter(target.getEnd()))
				.min(Comparator.comparing(TimePeriod::getStart));
	}

	public static LocalTime roundUpToXMin(LocalTime time, int min) {
		int m = time.getMinute();
		while (m % min != 0)
			m += 1;

		int h = time.getHour();
		int newMin = m == 60 ? 0 : m;
		if (m == 60)
			h = h + 1;

		return h > 23 ? LocalTime.MAX : LocalTime.of(h, newMin);
	}

	public static LocalTime getEarliestStartTime(Collection<List<TimePeriod>> times) {

		return times.stream()
				.flatMap(Collection::stream)
				.map(TimePeriod::getStart)
				.min(LocalTime::compareTo)
				.orElse(LocalTime.MAX);
	}

	public static LocalTime getLatestEndTime(Collection<List<TimePeriod>> times) {

		return times.stream()
				.flatMap(Collection::stream)
				.map(TimePeriod::getEnd)
				.min(Collections.reverseOrder(LocalTime::compareTo))
				.orElse(LocalTime.MIN);

	}
}
