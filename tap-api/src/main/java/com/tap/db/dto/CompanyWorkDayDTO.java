package com.tap.db.dto;

import java.time.LocalTime;

public record CompanyWorkDayDTO(long companyId, byte day, LocalTime start, LocalTime end, LocalTime breakStart, LocalTime breakEnd) {
}
