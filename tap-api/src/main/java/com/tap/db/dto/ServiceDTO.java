package com.tap.db.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
@Getter
@Setter
@AllArgsConstructor
public class ServiceDTO {
	private long id;
	private String name;
	private int duration;
	private BigDecimal price;

}
