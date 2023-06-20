package com.tap.db.entity_old;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalTime;

@Entity
@Table(name = "employee_work_days")
public class EmployeeWorkDay implements Serializable {
	@Serial
	private static final long serialVersionUID = 4070193684653704436L;
	private Long id;
	private Employee employee;
	private Byte startDay;
	private LocalTime startTime;
	private Byte startBreakDay;
	private LocalTime startBreakTime;
	private Byte endBreakDay;
	private LocalTime endBreakTime;
	private Byte endDay;
	private LocalTime endTime;
	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public EmployeeWorkDay setId(Long id) {
		this.id = id;
		return this;
	}

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	public Employee getEmployee() {
		return employee;
	}

	public EmployeeWorkDay setEmployee(Employee employee) {
		this.employee = employee;
		return this;
	}

	public Byte getStartDay() {
		return startDay;
	}

	public EmployeeWorkDay setStartDay(Byte startDay) {
		this.startDay = startDay;
		return this;
	}

	public LocalTime getStartTime() {
		return startTime;
	}

	public EmployeeWorkDay setStartTime(LocalTime startTime) {
		this.startTime = startTime;
		return this;
	}

	public Byte getStartBreakDay() {
		return startBreakDay;
	}

	public EmployeeWorkDay setStartBreakDay(Byte startBreakDay) {
		this.startBreakDay = startBreakDay;
		return this;
	}

	public LocalTime getStartBreakTime() {
		return startBreakTime;
	}

	public EmployeeWorkDay setStartBreakTime(LocalTime startBreakTime) {
		this.startBreakTime = startBreakTime;
		return this;
	}

	public Byte getEndBreakDay() {
		return endBreakDay;
	}

	public EmployeeWorkDay setEndBreakDay(Byte endBreakDay) {
		this.endBreakDay = endBreakDay;
		return this;
	}

	public LocalTime getEndBreakTime() {
		return endBreakTime;
	}

	public EmployeeWorkDay setEndBreakTime(LocalTime endBreakTime) {
		this.endBreakTime = endBreakTime;
		return this;
	}

	public Byte getEndDay() {
		return endDay;
	}

	public EmployeeWorkDay setEndDay(Byte endDay) {
		this.endDay = endDay;
		return this;
	}

	public LocalTime getEndTime() {
		return endTime;
	}

	public EmployeeWorkDay setEndTime(LocalTime endTime) {
		this.endTime = endTime;
		return this;
	}

	public Byte getActive() {
		return active;
	}

	public EmployeeWorkDay setActive(Byte active) {
		this.active = active;
		return this;
	}
}