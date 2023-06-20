package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "services")
public class Service implements Serializable {
	@Serial
	private static final long serialVersionUID = -3616470685412465576L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String description;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_type_id")
	private CompanyType companyType;
	private Byte active;

	public Long getId() {
		return id;
	}

	public Service setId(Long id) {
		this.id = id;
		return this;
	}

	public String getName() {
		return name;
	}

	public Service setName(String name) {
		this.name = name;
		return this;
	}

	public String getDescription() {
		return description;
	}

	public Service setDescription(String description) {
		this.description = description;
		return this;
	}

	public CompanyType getCompanyType() {
		return companyType;
	}

	public Service setCompanyType(CompanyType companyType) {
		this.companyType = companyType;
		return this;
	}

	public Byte getActive() {
		return active;
	}

	public Service setActive(Byte active) {
		this.active = active;
		return this;
	}
}