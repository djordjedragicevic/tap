package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalTime;

@Entity
@Table(name = "company_work_days")
public class CompanyWorkDay implements Serializable {
	@Serial
	private static final long serialVersionUID = 4525256279221062756L;
	private Long id;

	private Company company;

	private Byte day;

	private LocalTime start;

	private LocalTime end;

	private LocalTime breakStart;

	private LocalTime breakEnd;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public CompanyWorkDay setId(Long id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	public Company getCompany() {
		return company;
	}

	public CompanyWorkDay setCompany(Company company) {
		this.company = company;
		return this;
	}

	@Column(name = "day", nullable = false)
	public Byte getDay() {
		return day;
	}

	public CompanyWorkDay setDay(Byte day) {
		this.day = day;
		return this;
	}

	@Column(name = "start")
	public LocalTime getStart() {
		return start;
	}

	public CompanyWorkDay setStart(LocalTime start) {
		this.start = start;
		return this;
	}

	@Column(name = "end")
	public LocalTime getEnd() {
		return end;
	}

	public CompanyWorkDay setEnd(LocalTime end) {
		this.end = end;
		return this;
	}

	@Column(name = "break_start")
	public LocalTime getBreakStart() {
		return breakStart;
	}

	public CompanyWorkDay setBreakStart(LocalTime breakStart) {
		this.breakStart = breakStart;
		return this;
	}

	@Column(name = "break_end")
	public LocalTime getBreakEnd() {
		return breakEnd;
	}

	public CompanyWorkDay setBreakEnd(LocalTime breakEnd) {
		this.breakEnd = breakEnd;
		return this;
	}

	@Column(name = "active")
	public Byte getActive() {
		return active;
	}
	public CompanyWorkDay setActive(Byte active) {
		this.active = active;
		return this;
	}

}