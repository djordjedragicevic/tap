package com.tap.db.entity_old;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serial;
import java.io.Serializable;

@Table(name = "roles")
public class Role implements Serializable {
	@Serial
	private static final long serialVersionUID = -4998208052401026693L;
	private Short id;

	private String name;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "TINYINT UNSIGNED not null")
	public Short getId() {
		return id;
	}

	public Role setId(Short id) {
		this.id = id;
		return this;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public Role setName(String name) {
		this.name = name;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public Role setActive(Byte active) {
		this.active = active;
		return this;
	}

}