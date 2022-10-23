package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serializable;

@Entity
@Table(name = "countries")
public class Country implements Serializable {
	private static final long serialVersionUID = 8426157373867709364L;
	private Integer id;

	private String name;

	private String code;

	private Integer phone;

	private String currency;

	private String currencySymbol;

	private Byte active;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", columnDefinition = "SMALLINT UNSIGNED not null")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "code", nullable = false, length = 2)
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "phone", nullable = false)
	public Integer getPhone() {
		return phone;
	}

	public void setPhone(Integer phone) {
		this.phone = phone;
	}

	@Column(name = "currency", nullable = false, length = 4)
	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	@Column(name = "currency_symbol", nullable = false, length = 16)
	public String getCurrencySymbol() {
		return currencySymbol;
	}

	public void setCurrencySymbol(String currencySymbol) {
		this.currencySymbol = currencySymbol;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public void setActive(Byte active) {
		this.active = active;
	}

}