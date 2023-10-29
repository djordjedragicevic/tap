/**
 * Generated DTO class for "Address"
 */
package com.tap.db.dto;
public class AddressDto {	
	private Integer id;
	private String street;
	private String number;
	private Float longitude;
	private Float latitude;
	private String flatNumber;
	private String address1;
	private CityDto city; 
	public AddressDto() {}

	public AddressDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public AddressDto setStreet( String street ) {
		this.street = street;
		return this;
	}

	public String getStreet() {
		return this.street;
	}

	public AddressDto setNumber( String number ) {
		this.number = number;
		return this;
	}

	public String getNumber() {
		return this.number;
	}

	public AddressDto setLongitude( Float longitude ) {
		this.longitude = longitude;
		return this;
	}

	public Float getLongitude() {
		return this.longitude;
	}

	public AddressDto setLatitude( Float latitude ) {
		this.latitude = latitude;
		return this;
	}

	public Float getLatitude() {
		return this.latitude;
	}

	public AddressDto setFlatNumber( String flatNumber ) {
		this.flatNumber = flatNumber;
		return this;
	}

	public String getFlatNumber() {
		return this.flatNumber;
	}

	public AddressDto setAddress1( String address1 ) {
		this.address1 = address1;
		return this;
	}

	public String getAddress1() {
		return this.address1;
	}

	public CityDto getCity() {
		return this.city;
	}

	public AddressDto setCity(CityDto city) {
		this.city = city;
		return this;
	}
}