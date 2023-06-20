package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "cities")
public class City implements Serializable {
	@Serial
	private static final long serialVersionUID = 1702511742862236504L;
	private Integer id;

	private Country country;

	private String name;

	private String postCode;

	@Id
	@Column(name = "id", columnDefinition = "SMALLINT UNSIGNED not null")
	public Integer getId() {
		return id;
	}

	public City setId(Integer id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "country_id", nullable = false)
	public Country getCountry() {
		return country;
	}

	public City setCountry(Country country) {
		this.country = country;
		return this;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public City setName(String name) {
		this.name = name;
		return this;
	}

	@Column(name = "post_code", nullable = false, length = 16)
	public String getPostCode() {
		return postCode;
	}

	public City setPostCode(String postCode) {
		this.postCode = postCode;
		return this;
	}

}