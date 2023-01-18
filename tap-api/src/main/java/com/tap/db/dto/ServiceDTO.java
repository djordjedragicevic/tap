package com.tap.db.dto;

import java.math.BigDecimal;

public record ServiceDTO(long id, String name, int duration, BigDecimal price) {
	@Override
	public String toString() {
		return "ServiceDTO{" +
			   "id=" + id +
			   ", name='" + name + '\'' +
			   ", duration=" + duration +
			   ", price=" + price +
			   '}';
	}
}
