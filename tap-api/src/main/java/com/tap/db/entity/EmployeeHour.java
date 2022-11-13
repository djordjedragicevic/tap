package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalTime;

@Entity
@Table(name = "employee_hours")
public class EmployeeHour implements Serializable {
	@Serial
	private static final long serialVersionUID = 4070193684653704436L;
	private Long id;

	private CompanyEmployee companyEmployee;

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

	public EmployeeHour setId(Long id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_employee_id", nullable = false)
	public CompanyEmployee getCompanyEmployee() {
		return companyEmployee;
	}

	public EmployeeHour setCompanyEmployee(CompanyEmployee companyEmployee) {
		this.companyEmployee = companyEmployee;
		return this;
	}

	@Column(name = "day", nullable = false)
	public Byte getDay() {
		return day;
	}

	public EmployeeHour setDay(Byte day) {
		this.day = day;
		return this;
	}

	@Column(name = "start")
	public LocalTime getStart() {
		return start;
	}

	public EmployeeHour setStart(LocalTime start) {
		this.start = start;
		return this;
	}

	@Column(name = "end")
	public LocalTime getEnd() {
		return end;
	}

	public EmployeeHour setEnd(LocalTime end) {
		this.end = end;
		return this;
	}

	@Column(name = "break_start")
	public LocalTime getBreakStart() {
		return breakStart;
	}

	public EmployeeHour setBreakStart(LocalTime breakStart) {
		this.breakStart = breakStart;
		return this;
	}

	@Column(name = "break_end")
	public LocalTime getBreakEnd() {
		return breakEnd;
	}

	public EmployeeHour setBreakEnd(LocalTime breakEnd) {
		this.breakEnd = breakEnd;
		return this;
	}

}