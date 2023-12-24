package com.tap.common;

import java.time.LocalTime;
import java.util.Map;

public class TimePeriodData extends TimePeriod {

	public static final String CLOSE = "CLOSE";
	public static final String OPEN = "OPEN";
	public static final String WORK_INFO = "WORK_INFO";
	public static final String APPOINTMENT = "APPOINTMENT";
	public static final String CUSTOM_PERIOD = "CUSTOM_PERIOD";
	public static final String FREE_TIME = "FREE_TIME";


	private final String id;
	private final String variant;
	private final String name;
	private Object data;

	public TimePeriodData(LocalTime start, LocalTime end, String variant, String periodType, Long id) {
		super(start, end);
		this.variant = variant;
		this.name = periodType;
		this.id = Statics.PT_SHORT.get(periodType) + "#" + id;
	}

	public TimePeriodData(LocalTime start, LocalTime end, String variant, String periodType, Long id, Object data) {
		this(start, end, variant, periodType, id);
		this.data = data;
	}

	public TimePeriodData(LocalTime start, LocalTime end, String variant, String periodType, String id) {
		super(start, end);
		this.variant = variant;
		this.name = periodType;
		this.id = id;
	}

	public String getId() {
		return id;
	}

	public String getVariant() {
		return variant;
	}

	public String getName() {
		return name;
	}

	public Object getData() {
		return data;
	}
}
