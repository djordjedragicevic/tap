package com.tap.rest.dtor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AppointmentDtoSimple(
		Long id, LocalDateTime start, LocalDateTime end, String userName,
		Integer userId, String uUsername, String uEmail,
		Integer sId, String sName, BigDecimal sPrice, Short sDuration,
		Integer eId, String eName, String eImagePath,
		String sGName,
		String sCName,
		String status
) {
}
