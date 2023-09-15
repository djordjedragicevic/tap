package com.tap.db.dto;

import com.tap.db.entity.Group;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ServiceDto {
	private int id;
	private String name;
	private double price;
	private int duration;
	private Group group;
}
