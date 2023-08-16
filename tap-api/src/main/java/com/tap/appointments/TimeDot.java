package com.tap.appointments;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TimeDot {
	public static final byte FREE_OPEN = 1;
	public static final byte FREE_CLOSE = 2;

	private LocalDateTime dateTime;
	private byte type;
	private TimePeriodOld timePeriod;
}
