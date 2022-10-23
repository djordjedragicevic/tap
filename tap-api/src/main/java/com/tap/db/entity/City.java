package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "cities")
public class City implements Serializable {
	private static final long serialVersionUID = -2627665010959048525L;
	private Integer id;

	private Country country;

	private String name;

	private String postCode;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", columnDefinition = "SMALLINT UNSIGNED not null")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "country_id", nullable = false)
	public Country getCountry() {
		return country;
	}

	public void setCountry(Country country) {
		this.country = country;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "post_code", nullable = false, length = 16)
	public String getPostCode() {
		return postCode;
	}

	public void setPostCode(String postCode) {
		this.postCode = postCode;
	}

}