package com.tap.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalTime;

@Table(name = "w_employee_wd")
public class WEmployeeWD {

	@Id
	@Column(name = "ewd_id")
	private Long ewdId;
	@Column(name = "e_id")
	private Long employeeId;
	@Column(name = "start_day")
	private Byte startDay;
	@Column(name = "start_time")
	private LocalTime startTime;
	@Column(name = "end_day")
	private Byte endDay;
	@Column(name = "end_time")
	private LocalTime endTime;
	@Column(name = "break_start_day")
	private Byte breakStartDay;
	@Column(name = "break_start_time")
	private LocalTime breakStartTime;
	@Column(name = "break_end_day")
	private Byte breakEndDay;
	@Column(name = "break_end_time")
	private LocalTime breakEndTime;
	@Column(name = "ewd_active")
	private Byte ewdActive;
	@Column(name = "cwd_active")
	private Byte cwdActive;

	public Long getEwdId() {
		return ewdId;
	}

	public WEmployeeWD setEwdId(Long ewdId) {
		this.ewdId = ewdId;
		return this;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public WEmployeeWD setEmployeeId(Long employeeId) {
		this.employeeId = employeeId;
		return this;
	}

	public Byte getStartDay() {
		return startDay;
	}

	public WEmployeeWD setStartDay(Byte startDay) {
		this.startDay = startDay;
		return this;
	}

	public LocalTime getStartTime() {
		return startTime;
	}

	public WEmployeeWD setStartTime(LocalTime startTime) {
		this.startTime = startTime;
		return this;
	}

	public Byte getEndDay() {
		return endDay;
	}

	public WEmployeeWD setEndDay(Byte endDay) {
		this.endDay = endDay;
		return this;
	}

	public LocalTime getEndTime() {
		return endTime;
	}

	public WEmployeeWD setEndTime(LocalTime endTime) {
		this.endTime = endTime;
		return this;
	}

	public Byte getBreakStartDay() {
		return breakStartDay;
	}

	public WEmployeeWD setBreakStartDay(Byte breakStartDay) {
		this.breakStartDay = breakStartDay;
		return this;
	}

	public LocalTime getBreakStartTime() {
		return breakStartTime;
	}

	public WEmployeeWD setBreakStartTime(LocalTime breakStartTime) {
		this.breakStartTime = breakStartTime;
		return this;
	}

	public Byte getBreakEndDay() {
		return breakEndDay;
	}

	public WEmployeeWD setBreakEndDay(Byte breakEndDay) {
		this.breakEndDay = breakEndDay;
		return this;
	}

	public LocalTime getBreakEndTime() {
		return breakEndTime;
	}

	public WEmployeeWD setBreakEndTime(LocalTime breakEndTime) {
		this.breakEndTime = breakEndTime;
		return this;
	}

	public Byte getEwdActive() {
		return ewdActive;
	}

	public WEmployeeWD setEwdActive(Byte ewdActive) {
		this.ewdActive = ewdActive;
		return this;
	}

	public Byte getCwdActive() {
		return cwdActive;
	}

	public WEmployeeWD setCwdActive(Byte cwdActive) {
		this.cwdActive = cwdActive;
		return this;
	}

	@Override
	public String toString() {
		return "WEmployeeWD{" +
			   "employeeId=" + employeeId +
			   ", startDay=" + startDay +
			   ", startTime=" + startTime +
			   ", endDay=" + endDay +
			   ", endTime=" + endTime +
			   ", breakStartDay=" + breakStartDay +
			   ", breakStartTime=" + breakStartTime +
			   ", breakEndDay=" + breakEndDay +
			   ", breakEndTime=" + breakEndTime +
			   ", ewdActive=" + ewdActive +
			   ", cwdActive=" + cwdActive +
			   '}';
	}
}
