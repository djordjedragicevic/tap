package com.tap.db.dto;

import java.math.BigDecimal;

public record ServiceDTO(long id, String name, short duration, BigDecimal price) {
}
