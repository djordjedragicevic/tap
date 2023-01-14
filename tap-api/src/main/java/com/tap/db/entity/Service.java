package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "services")
public class Service implements Serializable {
	@Serial
	private static final long serialVersionUID = -3616470685412465576L;
	private Long id;

	private String name;

	private Company company;

	private Short duration;

	private BigDecimal price;

//	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public Service setId(Long id) {
		this.id = id;
		return this;
	}

	@JoinColumn(name = "name", nullable = false)
	public String getName() {
		return name;
	}

	public Service setName(String name) {
		this.name = name;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	public Company getCompany() {
		return company;
	}

	public Service setCompany(Company company) {
		this.company = company;
		return this;
	}

	@Column(name = "duration", nullable = false)
	public Short getDuration() {
		return duration;
	}

	public Service setDuration(Short duration) {
		this.duration = duration;
		return this;
	}

	@Column(name = "price", precision = 10, scale = 2)
	public BigDecimal getPrice() {
		return price;
	}

	public Service setPrice(BigDecimal price) {
		this.price = price;
		return this;
	}

//	@Column(name = "active", nullable = false)
//	public Byte getActive() {
//		return active;
//	}
//
//	public Service setActive(Byte active) {
//		this.active = active;
//		return this;
//	}

}