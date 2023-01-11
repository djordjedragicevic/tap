package com.tap.db.dto;

import java.time.LocalTime;

public record EmployeeWorkDay(Byte day, LocalTime start, LocalTime end, LocalTime breakStart, LocalTime breakEnd) {
}
