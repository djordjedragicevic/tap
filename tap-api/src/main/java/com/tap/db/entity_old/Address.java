package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "addresses")
public class Address implements Serializable {
	@Serial
	private static final long serialVersionUID = -4881507497497308324L;
	private Long id;

	private String street;

	private String number;

	private City city;

	private Float longitude;

	private Float latitude;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public Address setId(Long id) {
		this.id = id;
		return this;
	}

	@Column(name = "street", nullable = false, length = 128)
	public String getStreet() {
		return street;
	}

	public Address setStreet(String street) {
		this.street = street;
		return this;
	}

	@Column(name = "number", nullable = false, length = 16)
	public String getNumber() {
		return number;
	}

	public Address setNumber(String number) {
		this.number = number;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "city_id", nullable = false)
	public City getCity() {
		return city;
	}

	public Address setCity(City city) {
		this.city = city;
		return this;
	}

	@Column(name = "longitude")
	public Float getLongitude() {
		return longitude;
	}

	public Address setLongitude(Float longitude) {
		this.longitude = longitude;
		return this;
	}

	@Column(name = "latitude")
	public Float getLatitude() {
		return latitude;
	}

	public Address setLatitude(Float latitude) {
		this.latitude = latitude;
		return this;
	}

}