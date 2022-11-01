package com.tap.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "services")
public class Service implements Serializable {
	@Serial
	private static final long serialVersionUID = -4746133049154204597L;
	private Long id;

	private String name;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public Service setId(Long id) {
		this.id = id;
		return this;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public Service setName(String name) {
		this.name = name;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public Service setActive(Byte active) {
		this.active = active;
		return this;
	}

}