package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "addresses")
public class Address implements Serializable {
	private static final long serialVersionUID = -4214246386418010257L;
	private Long id;

	private City city;

	private String address;

	private Float longitude;

	private Float latitude;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "city_id", nullable = false)
	public City getCity() {
		return city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	@Column(name = "address", nullable = false, length = 64)
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "longitude")
	public Float getLongitude() {
		return longitude;
	}

	public void setLongitude(Float longitude) {
		this.longitude = longitude;
	}

	@Column(name = "latitude")
	public Float getLatitude() {
		return latitude;
	}

	public void setLatitude(Float latitude) {
		this.latitude = latitude;
	}

}