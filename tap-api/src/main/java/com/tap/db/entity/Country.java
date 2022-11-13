package com.tap.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "countries")
public class Country implements Serializable {
	@Serial
	private static final long serialVersionUID = 7574237729822733853L;
	private Integer id;

	private String name;

	private String code;

	private Integer phone;

	private String currency;

	private String currencySymbol;

	private Byte active;

	@Id
	@Column(name = "id", columnDefinition = "SMALLINT UNSIGNED not null")
	public Integer getId() {
		return id;
	}

	public Country setId(Integer id) {
		this.id = id;
		return this;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public Country setName(String name) {
		this.name = name;
		return this;
	}

	@Column(name = "code", nullable = false, length = 2)
	public String getCode() {
		return code;
	}

	public Country setCode(String code) {
		this.code = code;
		return this;
	}

	@Column(name = "phone", nullable = false)
	public Integer getPhone() {
		return phone;
	}

	public Country setPhone(Integer phone) {
		this.phone = phone;
		return this;
	}

	@Column(name = "currency", nullable = false, length = 4)
	public String getCurrency() {
		return currency;
	}

	public Country setCurrency(String currency) {
		this.currency = currency;
		return this;
	}

	@Column(name = "currency_symbol", nullable = false, length = 16)
	public String getCurrencySymbol() {
		return currencySymbol;
	}

	public Country setCurrencySymbol(String currencySymbol) {
		this.currencySymbol = currencySymbol;
		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public Country setActive(Byte active) {
		this.active = active;
		return this;
	}

}