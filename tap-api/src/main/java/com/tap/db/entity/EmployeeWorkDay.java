package com.tap.db.entity;

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

	private Byte day;

	private LocalTime start;

	private LocalTime end;

	private LocalTime breakStart;

	private LocalTime breakEnd;

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

	@Column(name = "day", nullable = false)
	public Byte getDay() {
		return day;
	}

	public EmployeeWorkDay setDay(Byte day) {
		this.day = day;
		return this;
	}

	@Column(name = "start")
	public LocalTime getStart() {
		return start;
	}

	public EmployeeWorkDay setStart(LocalTime start) {
		this.start = start;
		return this;
	}

	@Column(name = "end")
	public LocalTime getEnd() {
		return end;
	}

	public EmployeeWorkDay setEnd(LocalTime end) {
		this.end = end;
		return this;
	}

	@Column(name = "break_start")
	public LocalTime getBreakStart() {
		return breakStart;
	}

	public EmployeeWorkDay setBreakStart(LocalTime breakStart) {
		this.breakStart = breakStart;
		return this;
	}

	@Column(name = "break_end")
	public LocalTime getBreakEnd() {
		return breakEnd;
	}

	public EmployeeWorkDay setBreakEnd(LocalTime breakEnd) {
		this.breakEnd = breakEnd;
		return this;
	}

}