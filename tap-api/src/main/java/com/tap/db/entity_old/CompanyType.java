package com.tap.db.entity_old;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "company_types")
public class CompanyType implements Serializable {
	@Serial
	private static final long serialVersionUID = 2926093987806435037L;
	private Integer id;

	private String name;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "SMALLINT UNSIGNED not null")
	public Integer getId() {
		return id;
	}

	public CompanyType setId(Integer id) {
		this.id = id;
		return this;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public CompanyType setName(String name) {
		this.name = name;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public CompanyType setActive(Byte active) {
		this.active = active;
		return this;
	}

}