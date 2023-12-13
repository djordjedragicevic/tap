package com.tap.appointments;

import com.tap.common.TimePeriod;
import com.tap.common.Util;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

public class Utils {

	public static final String EVERY_DAY = "EVERY_DAY";
	public static final String EVERY_WEEK = "EVERY_WEEK";
	public static final String EVERY_MONT = "EVERY_MONTH";
	public static final String EVERY_YEAR = "EVERT_YEAR";
	public static final int DAYS_TO_GET = 3;
	public static final int FREE_APP_DAYS = 10;


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

	public static TimePeriod adjustRepeatablePeriodToOnaDate(LocalDate atDate, LocalDateTime start, LocalDateTime end, String repeatType) {
		LocalDateTime borderFrom = atDate.atTime(LocalTime.MIN);
		LocalDateTime borderTo = atDate.atTime(LocalTime.MAX);
		LocalDateTime realStart = convertToRealDT(borderFrom.toLocalDate(), repeatType, start);
		LocalDateTime realEnd = convertToRealDT(borderTo.toLocalDate(), repeatType, end);
		LocalTime from = realStart.isBefore(borderFrom) ? borderFrom.toLocalTime() : realStart.toLocalTime();
		LocalTime to = realEnd.isAfter(borderTo) ? borderTo.toLocalTime() : realEnd.toLocalTime();
		return new TimePeriod(from, to);
	}

	public static TimePeriod adjustPeriodToOnaDate(LocalDate atDate, LocalDateTime start, LocalDateTime end) {
		LocalTime from = start.isBefore(atDate.atTime(LocalTime.MIN)) ? LocalTime.MIN : start.toLocalTime();
		LocalTime to = end.isAfter(atDate.atTime(LocalTime.MAX)) ? LocalTime.MAX : end.toLocalTime();
		return new TimePeriod(from, to);
	}

	public static String generateJoinId(LocalDateTime dT, Integer pId, List<Integer> sIds) {
		return dT.atZone(Util.zone()).toEpochSecond() + "S" + sIds.stream().map(String::valueOf).collect(Collectors.joining("_")) + "P" + pId;
	}

	private static LocalDateTime convertToRealDT(LocalDate atDate, String repeatType, LocalDateTime repeatDateTime) {
		switch (repeatType) {
			case Utils.EVERY_WEEK -> {
				return atDate.minusDays(atDate.getDayOfWeek().getValue() - repeatDateTime.getDayOfWeek().getValue()).atTime(repeatDateTime.toLocalTime());
			}
			case Utils.EVERY_MONT -> {
				return atDate.minusDays(atDate.getDayOfMonth() - repeatDateTime.getDayOfMonth()).atTime(repeatDateTime.toLocalTime());
			}
			case Utils.EVERY_YEAR -> {
				return repeatDateTime.withYear(atDate.getYear());
			}
			//Also cover EVERY_DAY type
			default -> {
				return atDate.atTime(repeatDateTime.toLocalTime());
			}
		}
	}
}
