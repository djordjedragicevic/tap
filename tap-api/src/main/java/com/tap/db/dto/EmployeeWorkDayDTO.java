package com.tap.db.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
@Getter
@Setter
public class EmployeeWorkDayDTO {
	private Long id;
	private Long employeeId;
	private Byte startDay;
	private LocalTime startTime;
	private Byte endDay;
	private LocalTime endTime;
	private Byte breakStartDay;
	private LocalTime breakStartTime;
	private Byte breakEndDay;
	private LocalTime breakEndTime;

	public boolean hasBreak() {
		return this.getBreakStartDay() != null && this.getBreakStartTime() != null && this.getBreakEndDay() != null && this.getBreakEndTime() != null;
	}
}
