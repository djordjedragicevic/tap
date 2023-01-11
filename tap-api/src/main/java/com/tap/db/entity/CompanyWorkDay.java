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

	private LocalTime open;

	private LocalTime close;

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

	@Column(name = "open")
	public LocalTime getOpen() {
		return open;
	}

	public CompanyWorkDay setOpen(LocalTime open) {
		this.open = open;
		return this;
	}

	@Column(name = "close")
	public LocalTime getClose() {
		return close;
	}

	public CompanyWorkDay setClose(LocalTime close) {
		this.close = close;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public CompanyWorkDay setActive(Byte active) {
		this.active = active;
		return this;
	}

}