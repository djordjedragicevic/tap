package com.tap.db.dto;

import java.time.LocalTime;

public record CompanyWorkDay(Byte day, LocalTime open, LocalTime close) {
}
