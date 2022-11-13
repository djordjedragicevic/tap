package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "company_services")
public class CompanyService implements Serializable {
	@Serial
	private static final long serialVersionUID = -3616470685412465576L;
	private Long id;

	private Service service;

	private Company company;

	private LocalTime duration;

	private BigDecimal price;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public CompanyService setId(Long id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "service_id", nullable = false)
	public Service getService() {
		return service;
	}

	public CompanyService setService(Service service) {
		this.service = service;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	public Company getCompany() {
		return company;
	}

	public CompanyService setCompany(Company company) {
		this.company = company;
		return this;
	}

	@Column(name = "duration", nullable = false)
	public LocalTime getDuration() {
		return duration;
	}

	public CompanyService setDuration(LocalTime duration) {
		this.duration = duration;
		return this;
	}

	@Column(name = "price", precision = 10, scale = 2)
	public BigDecimal getPrice() {
		return price;
	}

	public CompanyService setPrice(BigDecimal price) {
		this.price = price;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public CompanyService setActive(Byte active) {
		this.active = active;
		return this;
	}

}