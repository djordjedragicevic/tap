package com.tap.db.dto;

import java.time.LocalTime;

public class EmployeeWorkDayDTO {
	private long id;
	private long employeeId;
	private byte startDay;
	private LocalTime startTime;
	private byte endDay;
	private LocalTime endTime;
	private byte breakStartDay;
	private LocalTime breakStartTime;
	private byte breakEndDay;
	private LocalTime breakEndTime;

	public long getId() {
		return id;
	}

	public EmployeeWorkDayDTO setId(long id) {
		this.id = id;
		return this;
	}

	public long getEmployeeId() {
		return employeeId;
	}

	public EmployeeWorkDayDTO setEmployeeId(long employeeId) {
		this.employeeId = employeeId;
		return this;
	}

	public byte getStartDay() {
		return startDay;
	}

	public EmployeeWorkDayDTO setStartDay(byte startDay) {
		this.startDay = startDay;
		return this;
	}

	public LocalTime getStartTime() {
		return startTime;
	}

	public EmployeeWorkDayDTO setStartTime(LocalTime startTime) {
		this.startTime = startTime;
		return this;
	}

	public byte getEndDay() {
		return endDay;
	}

	public EmployeeWorkDayDTO setEndDay(byte endDay) {
		this.endDay = endDay;
		return this;
	}

	public LocalTime getEndTime() {
		return endTime;
	}

	public EmployeeWorkDayDTO setEndTime(LocalTime endTime) {
		this.endTime = endTime;
		return this;
	}

	public byte getBreakStartDay() {
		return breakStartDay;
	}

	public EmployeeWorkDayDTO setBreakStartDay(byte breakStartDay) {
		this.breakStartDay = breakStartDay;
		return this;
	}

	public LocalTime getBreakStartTime() {
		return breakStartTime;
	}

	public EmployeeWorkDayDTO setBreakStartTime(LocalTime breakStartTime) {
		this.breakStartTime = breakStartTime;
		return this;
	}

	public byte getBreakEndDay() {
		return breakEndDay;
	}

	public EmployeeWorkDayDTO setBreakEndDay(byte breakEndDay) {
		this.breakEndDay = breakEndDay;
		return this;
	}

	public LocalTime getBreakEndTime() {
		return breakEndTime;
	}

	public EmployeeWorkDayDTO setBreakEndTime(LocalTime breakEndTime) {
		this.breakEndTime = breakEndTime;
		return this;
	}
}
