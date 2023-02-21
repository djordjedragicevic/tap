package com.tap.db.dto;

import com.tap.appointments.TimePeriod;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class CalendarDayDTO {
	private LocalDate date;
	private List<TimePeriod> periods;

	private boolean isWorking;

	public CalendarDayDTO(LocalDate date) {
		this.date = date;
		this.periods = new ArrayList<>();
		this.isWorking = true;
	}

	public CalendarDayDTO addTimePeriod(TimePeriod tp){
		this.periods.add(tp);
		return this;
	}
}
