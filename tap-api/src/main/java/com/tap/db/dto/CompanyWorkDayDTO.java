package com.tap.db.dto;

import java.time.LocalTime;
import java.time.temporal.ChronoField;

public class CompanyWorkDayDTO {
	private long companyId;
	private byte day;
	private LocalTime start;
	private LocalTime end;
	private LocalTime breakStart;
	private LocalTime breakEnd;
	private int startMOD;
	private int endMOD;

	public CompanyWorkDayDTO(long companyId, byte day, LocalTime start, LocalTime end, LocalTime breakStart, LocalTime breakEnd) {
		this.companyId = companyId;
		this.day = day;
		this.start = start;
		this.end = end;
		this.breakStart = breakStart;
		this.breakEnd = breakEnd;
		this.startMOD = start.get(ChronoField.MINUTE_OF_DAY);
		this.endMOD = end.get(ChronoField.MINUTE_OF_DAY);
	}

	public long getCompanyId() {
		return companyId;
	}

	public byte getDay() {
		return day;
	}

	public LocalTime getStart() {
		return start;
	}

	public LocalTime getEnd() {
		return end;
	}

	public LocalTime getBreakStart() {
		return breakStart;
	}

	public LocalTime getBreakEnd() {
		return breakEnd;
	}

	public int getStartMOD() {
		return startMOD;
	}

	public int getEndMOD() {
		return endMOD;
	}
}
