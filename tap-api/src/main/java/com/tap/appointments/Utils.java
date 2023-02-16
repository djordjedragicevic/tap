package com.tap.appointments;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class Utils {

	public static final int DAYS_TO_GET = 3;
	public static Optional<LocalDateTime> parseDT (String dt){
		return  Optional.ofNullable(dt != null && !dt.isEmpty() ? LocalDateTime.parse(dt, DateTimeFormatter.ISO_DATE) : null);
	}

	public static List<Long> parseIDs (String ids){
		return Arrays.stream(ids.split(",")).map(Long::valueOf).toList();
	}
}
