package com.tap.db.dto;

import java.time.LocalDateTime;

public class EffectiveEmployeeWorkDayDTO {
	private long employeeId;
	private LocalDateTime start;
	private LocalDateTime end;
	private LocalDateTime breakStart;
	private LocalDateTime breakEnd;

	public EffectiveEmployeeWorkDayDTO(long employeeId, LocalDateTime start, LocalDateTime end, LocalDateTime breakStart, LocalDateTime breakEnd) {
		this.employeeId = employeeId;
		this.start = start;
		this.end = end;
		this.breakStart = breakStart;
		this.breakEnd = breakEnd;
	}

	public long getEmployeeId() {
		return employeeId;
	}

	public LocalDateTime getStart() {
		return start;
	}

	public LocalDateTime getEnd() {
		return end;
	}

	public LocalDateTime getBreakStart() {
		return breakStart;
	}

	public LocalDateTime getBreakEnd() {
		return breakEnd;
	}

	@Override
	public String toString() {
		return "EffectiveEmployeeWorkDayDTO{" +
			   "employeeId=" + employeeId +
			   ", start=" + start +
			   ", end=" + end +
			   ", breakStart=" + breakStart +
			   ", breakEnd=" + breakEnd +
			   '}';
	}
}
