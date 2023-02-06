package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "company_service")
public class CompanyService implements Serializable {
	@Serial
	private static final long serialVersionUID = -4838001515916501235L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne(fetch = FetchType.LAZY)
	private Company company;
	@ManyToOne(fetch = FetchType.LAZY)
	private Service service;
	private BigDecimal price;
	private Integer duration;
	private Byte active;

	public Long getId() {
		return id;
	}

	public CompanyService setId(Long id) {
		this.id = id;
		return this;
	}

	public Company getCompany() {
		return company;
	}

	public CompanyService setCompany(Company company) {
		this.company = company;
		return this;
	}

	public Service getService() {
		return service;
	}

	public CompanyService setService(Service service) {
		this.service = service;
		return this;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public CompanyService setPrice(BigDecimal price) {
		this.price = price;
		return this;
	}

	public Integer getDuration() {
		return duration;
	}

	public CompanyService setDuration(Integer duration) {
		this.duration = duration;
		return this;
	}

	public Byte getActive() {
		return active;
	}

	public CompanyService setActive(Byte active) {
		this.active = active;
		return this;
	}
}