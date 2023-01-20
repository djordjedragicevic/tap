package com.tap.db.dto;

import java.math.BigDecimal;

public record ServiceDTO(long getId, String getName, int getDuration, BigDecimal getPrice) {
}
