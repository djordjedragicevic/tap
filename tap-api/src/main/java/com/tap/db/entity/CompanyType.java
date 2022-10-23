package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "company_types")
public class CompanyType implements Serializable {
	private static final long serialVersionUID = 400425423297764651L;
	private Integer id;

	private String name;

	private Byte active;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", columnDefinition = "SMALLINT UNSIGNED not null")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public void setActive(Byte active) {
		this.active = active;
	}

}