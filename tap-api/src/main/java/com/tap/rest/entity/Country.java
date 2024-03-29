/**
 * Generated JPA entity class for "Country"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

@Entity
@Table(name="country", catalog="tap" )
public class Country implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private short id;

    @Column(name="name", nullable=false, length=64)
	private String name;

    @Column(name="code", nullable=false, length=2)
	private String code;

    @Column(name="phone", nullable=false)
	private int phone;

    @Column(name="currency", nullable=false, length=4)
	private String currency;

    @Column(name="currency_symbol", nullable=false, length=16)
	private String currencySymbol;

    @Column(name="active", nullable=false)
	private byte active;


    @OneToMany(mappedBy="country")
	@JsonbTransient
	private List<City> cityList; 

	public Country() {
		super();
	}
	
	public void setId( short id ) {
		this.id = id;
	}

	public short getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setCode( String code ) {
		this.code = code;
	}

	public String getCode() {
		return this.code;
	}

	public void setPhone( int phone ) {
		this.phone = phone;
	}

	public int getPhone() {
		return this.phone;
	}

	public void setCurrency( String currency ) {
		this.currency = currency;
	}

	public String getCurrency() {
		return this.currency;
	}

	public void setCurrencySymbol( String currencySymbol ) {
		this.currencySymbol = currencySymbol;
	}

	public String getCurrencySymbol() {
		return this.currencySymbol;
	}

	public void setActive( byte active ) {
		this.active = active;
	}

	public byte getActive() {
		return this.active;
	}

	public List<City> getCityList() {
		return this.cityList;
	}
	
	public void setCityList(List<City> cityList) {
		this.cityList = cityList;
	}
}