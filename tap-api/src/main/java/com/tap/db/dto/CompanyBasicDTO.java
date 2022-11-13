package com.tap.db.dto;

import java.io.Serializable;
import java.util.Objects;

public class CompanyBasicDTO implements Serializable {
	private final Long id;
	private final String name;
	private final String typeName;
	private final String addressStreet;
	private final String addressNumber;
	private final Float addressLongitude;
	private final Float addressLatitude;

	public CompanyBasicDTO(Long id, String name, String typeName, String addressStreet, String addressNumber, Float addressLongitude, Float addressLatitude) {
		this.id = id;
		this.name = name;
		this.typeName = typeName;
		this.addressStreet = addressStreet;
		this.addressNumber = addressNumber;
		this.addressLongitude = addressLongitude;
		this.addressLatitude = addressLatitude;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getTypeName() {
		return typeName;
	}

	public String getAddressStreet() {
		return addressStreet;
	}

	public String getAddressNumber() {
		return addressNumber;
	}

	public Float getAddressLongitude() {
		return addressLongitude;
	}

	public Float getAddressLatitude() {
		return addressLatitude;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		CompanyBasicDTO entity = (CompanyBasicDTO) o;
		return Objects.equals(this.id, entity.id) &&
				Objects.equals(this.name, entity.name) &&
				Objects.equals(this.typeName, entity.typeName) &&
				Objects.equals(this.addressStreet, entity.addressStreet) &&
				Objects.equals(this.addressNumber, entity.addressNumber) &&
				Objects.equals(this.addressLongitude, entity.addressLongitude) &&
				Objects.equals(this.addressLatitude, entity.addressLatitude);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name, typeName, addressStreet, addressNumber, addressLongitude, addressLatitude);
	}

	@Override
	public String toString() {
		return getClass().getSimpleName() + "(" +
				"id = " + id + ", " +
				"name = " + name + ", " +
				"typeName = " + typeName + ", " +
				"addressStreet = " + addressStreet + ", " +
				"addressNumber = " + addressNumber + ", " +
				"addressLongitude = " + addressLongitude + ", " +
				"addressLatitude = " + addressLatitude + ")";
	}
}
