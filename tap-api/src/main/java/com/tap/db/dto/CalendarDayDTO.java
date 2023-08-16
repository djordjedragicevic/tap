package com.tap.db.dto;

import com.tap.appointments.TimePeriodOld;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class CalendarDayDTO {
	private LocalDate date;
	private List<TimePeriodOld> periods;

	private boolean isWorking;

	public CalendarDayDTO(LocalDate date) {
		this.date = date;
		this.periods = new ArrayList<>();
		this.isWorking = true;
	}

	public CalendarDayDTO addTimePeriod(TimePeriodOld tp){
		this.periods.add(tp);
		return this;
	}
}
