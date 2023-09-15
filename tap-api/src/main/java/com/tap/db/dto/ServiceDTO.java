package com.tap.db.dto;

import com.tap.db.entity.Group;

import java.math.BigDecimal;

public class ServiceDTO {
	private int id;
	private String name;
	private double price;
	private int duration;
	private Group group;

	public ServiceDTO(int id, String name, double price, int duration) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.duration = duration;
	}

	public ServiceDTO(int id, String name, double price, int duration, Group group) {
		this(id, name, price, duration);
		this.group = group;
	}

	public int getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public double getPrice() {
		return price;
	}

	public int getDuration() {
		return duration;
	}

	public Group getGroup() {
		return group;
	}
}
