package com.tap.appointments;

import com.tap.db.dto.AppointmentDTO;
import com.tap.db.dto.EmployeeDTO;
import com.tap.db.dto.EmployeeWorkDayDTO;
import lombok.Data;
import lombok.Getter;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Data
public class TimePeriod {
	public static final String FREE = "FREE";
	public static final String BUSY = "BUSY";
	public static final String FREE_APPOINTMENT = "FREE_APPOINTMENT";
	public static final String FREE_PERIOD = "FREE_PERIOD";
	public static final String BUSY_APPOINTMENT = "BUSY_APPOINTMENT";
	public static final String BUSY_DO_NOT_WORK = "BUSY_DO_NOT_WORK";
	public static final String BUSY_BREAK = "BUSY_BREAK";
	public static final String FREE_WORK_HOURS = "FREE_WORK_HOURS";

	private LocalDateTime start;
	private LocalDateTime end;
	private String type;
	private String subType;

	public TimePeriod(LocalDateTime start, LocalDateTime end, String type, String subType) {
		this.start = start;
		this.end = end;
		this.type = type;
		this.subType = subType;
	}

	public static TimePeriod doesNotWork(LocalDate d) {
		return new TimePeriod(LocalDateTime.of(d, LocalTime.MIDNIGHT), LocalDateTime.of(d, LocalTime.MAX), BUSY, BUSY_DO_NOT_WORK);
	}

	public static TimePeriod ofAppointment(AppointmentDTO a) {
		return new TimePeriod(a.getStart(), a.getEnd(), TimePeriod.BUSY, TimePeriod.BUSY_APPOINTMENT);
	}

	public static TimePeriod ofEmployeeWorkDate(LocalDate d, EmployeeWorkDayDTO eWD) {
		return new TimePeriod(LocalDateTime.of(d, eWD.getStartTime()), LocalDateTime.of(d, eWD.getEndTime()), TimePeriod.FREE, TimePeriod.FREE_WORK_HOURS);
	}

	public static TimePeriod ofEmployeeBrake(LocalDate d, EmployeeWorkDayDTO eWD) {
		return new TimePeriod(LocalDateTime.of(d, eWD.getBreakStartTime()), LocalDateTime.of(d, eWD.getBreakEndTime()), TimePeriod.BUSY, TimePeriod.BUSY_BREAK);
	}

}
