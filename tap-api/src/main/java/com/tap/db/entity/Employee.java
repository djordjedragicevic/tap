package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "employees")
public class Employee implements Serializable {
	@Serial
	private static final long serialVersionUID = 9137298804243314506L;
	private Long id;

	private User user;

	private Company company;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public Employee setId(Long id) {
		this.id = id;
		return this;
	}

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	public User getUser() {
		return user;
	}

	public Employee setUser(User user) {
		this.user = user;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	public Company getCompany() {
		return company;
	}

	public Employee setCompany(Company company) {
		this.company = company;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public Employee setActive(Byte active) {
		this.active = active;
		return this;
	}

}