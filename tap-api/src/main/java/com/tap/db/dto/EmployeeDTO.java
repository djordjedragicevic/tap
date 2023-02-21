package com.tap.db.dto;

import com.tap.appointments.TimePeriod;
import com.tap.company.CompanyDAO;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.*;

@Getter
@Setter
public class EmployeeDTO {
	private Long id;
	private UserDTO user;
	private List<EmployeeWorkDayDTO> workDays;
	private List<CalendarDayDTO> calendar;
	private List<TimePeriod> periods;
	private List<ServiceDTO> lookingServices;
	private CompanyDTO company;


	public void addTimePeriod(LocalDate d, TimePeriod tp) {
		if (this.calendar == null)
			this.calendar = new ArrayList<>();

		if (tp != null)
			this.getCalendarDay(d).getPeriods().add(tp);
		else
			this.getCalendarDay(d).setWorking(false);

	}

	public CalendarDayDTO getCalendarDay(LocalDate date) {
		if (this.calendar == null)
			this.calendar = new ArrayList<>();

		return this.calendar.stream()
				.filter(d -> d.getDate().isEqual(date))
				.findAny()
				.orElseGet(() -> {
					CalendarDayDTO cD = new CalendarDayDTO(date);
					this.calendar.add(cD);
					return cD;
				});
	}
}
