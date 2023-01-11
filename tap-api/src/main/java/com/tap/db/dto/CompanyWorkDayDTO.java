package com.tap.db.dto;

import java.time.LocalTime;

public record CompanyWorkDayDTO(Byte day, LocalTime open, LocalTime close) {
}
