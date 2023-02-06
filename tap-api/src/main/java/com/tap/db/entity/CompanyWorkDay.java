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

	public Byte getStartDay() {
		return startDay;
	}

	public CompanyWorkDay setStartDay(Byte startDay) {
		this.startDay = startDay;
		return this;
	}

	public LocalTime getStartTime() {
		return startTime;
	}

	public CompanyWorkDay setStartTime(LocalTime startTime) {
		this.startTime = startTime;
		return this;
	}

	public Byte getStartBreakDay() {
		return startBreakDay;
	}

	public CompanyWorkDay setStartBreakDay(Byte startBreakDay) {
		this.startBreakDay = startBreakDay;
		return this;
	}

	public LocalTime getStartBreakTime() {
		return startBreakTime;
	}

	public CompanyWorkDay setStartBreakTime(LocalTime startBreakTime) {
		this.startBreakTime = startBreakTime;
		return this;
	}

	public Byte getEndBreakDay() {
		return endBreakDay;
	}

	public CompanyWorkDay setEndBreakDay(Byte endBreakDay) {
		this.endBreakDay = endBreakDay;
		return this;
	}

	public LocalTime getEndBreakTime() {
		return endBreakTime;
	}

	public CompanyWorkDay setEndBreakTime(LocalTime endBreakTime) {
		this.endBreakTime = endBreakTime;
		return this;
	}

	public Byte getEndDay() {
		return endDay;
	}

	public CompanyWorkDay setEndDay(Byte endDay) {
		this.endDay = endDay;
		return this;
	}

	public LocalTime getEndTime() {
		return endTime;
	}

	public CompanyWorkDay setEndTime(LocalTime endTime) {
		this.endTime = endTime;
		return this;
	}

	public Byte getActive() {
		return active;
	}

	public CompanyWorkDay setActive(Byte active) {
		this.active = active;
		return this;
	}
}