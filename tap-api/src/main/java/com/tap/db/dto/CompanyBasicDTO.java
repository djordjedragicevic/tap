package com.tap.db.dto;

public class CompanyBasicDTO {
	long id;
	String name;
	String typeName;
	String addressStreet;
	String addressNumber;
	float addressLongitude;
	float addressLatitude;

	public CompanyBasicDTO(long id, String name, String typeName, String addressStreet, String addressNumber, float addressLongitude, float addressLatitude) {
		this.id = id;
		this.name = name;
		this.typeName = typeName;
		this.addressStreet = addressStreet;
		this.addressNumber = addressNumber;
		this.addressLongitude = addressLongitude;
		this.addressLatitude = addressLatitude;
	}

	public long getId() {
		return id;
	}

	public CompanyBasicDTO setId(long id) {
		this.id = id;
		return this;
	}

	public String getName() {
		return name;
	}

	public CompanyBasicDTO setName(String name) {
		this.name = name;
		return this;
	}

	public String getTypeName() {
		return typeName;
	}

	public CompanyBasicDTO setTypeName(String typeName) {
		this.typeName = typeName;
		return this;
	}

	public String getAddressStreet() {
		return addressStreet;
	}

	public CompanyBasicDTO setAddressStreet(String addressStreet) {
		this.addressStreet = addressStreet;
		return this;
	}

	public String getAddressNumber() {
		return addressNumber;
	}

	public CompanyBasicDTO setAddressNumber(String addressNumber) {
		this.addressNumber = addressNumber;
		return this;
	}

	public float getAddressLongitude() {
		return addressLongitude;
	}

	public CompanyBasicDTO setAddressLongitude(float addressLongitude) {
		this.addressLongitude = addressLongitude;
		return this;
	}

	public float getAddressLatitude() {
		return addressLatitude;
	}

	public CompanyBasicDTO setAddressLatitude(float addressLatitude) {
		this.addressLatitude = addressLatitude;
		return this;
	}

	@Override
	public String toString() {
		return "CompanyBasicDTO{" +
			   "id=" + id +
			   ", name='" + name + '\'' +
			   ", typeName='" + typeName + '\'' +
			   ", addressStreet='" + addressStreet + '\'' +
			   ", addressNumber='" + addressNumber + '\'' +
			   ", addressLongitude=" + addressLongitude +
			   ", addressLatitude=" + addressLatitude +
			   '}';
	}
}