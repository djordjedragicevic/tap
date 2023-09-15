/**
 * Generated DTO class for "City"
 */
package com.tap.db.dto;
public class CityDto {	
	private Short id;
	private String name;
	private String postCode;
	private CountryDto country; 
	public CityDto() {}

	public CityDto setId( Short id ) {
		this.id = id;
		return this;
	}

	public Short getId() {
		return this.id;
	}

	public CityDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public CityDto setPostCode( String postCode ) {
		this.postCode = postCode;
		return this;
	}

	public String getPostCode() {
		return this.postCode;
	}

	public CountryDto getCountry() {
		return this.country;
	}

	public CityDto setCountry(CountryDto country) {
		this.country = country;
		return this;
	}
}