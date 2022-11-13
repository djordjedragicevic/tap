package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "company_employees")
public class CompanyEmployee implements Serializable {
	@Serial
	private static final long serialVersionUID = 9137298804243314506L;
	private Long id;

	private User employee;

	private Company company;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public CompanyEmployee setId(Long id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	public User getEmployee() {
		return employee;
	}

	public CompanyEmployee setEmployee(User employee) {
		this.employee = employee;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	public Company getCompany() {
		return company;
	}

	public CompanyEmployee setCompany(Company company) {
		this.company = company;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public CompanyEmployee setActive(Byte active) {
		this.active = active;
		return this;
	}

}