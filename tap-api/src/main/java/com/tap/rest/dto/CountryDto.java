/**
 * Generated DTO class for "Country"
 */
package com.tap.rest.dto;
public class CountryDto {	
	private Short id;
	private String name;
	private String code;
	private Integer phone;
	private String currency;
	private String currencySymbol;
	public CountryDto() {}

	public CountryDto setId( Short id ) {
		this.id = id;
		return this;
	}

	public Short getId() {
		return this.id;
	}

	public CountryDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public CountryDto setCode( String code ) {
		this.code = code;
		return this;
	}

	public String getCode() {
		return this.code;
	}

	public CountryDto setPhone( int phone ) {
		this.phone = phone;
		return this;
	}

	public int getPhone() {
		return this.phone;
	}

	public CountryDto setCurrency( String currency ) {
		this.currency = currency;
		return this;
	}

	public String getCurrency() {
		return this.currency;
	}

	public CountryDto setCurrencySymbol( String currencySymbol ) {
		this.currencySymbol = currencySymbol;
		return this;
	}

	public String getCurrencySymbol() {
		return this.currencySymbol;
	}

}