package com.tap.db.dto;

import java.time.LocalDateTime;

public record AppointmentDTO(Long id, Long serviceId, Long employeeId, Long userId, LocalDateTime createTime, LocalDateTime startTime, LocalDateTime endTime) {
}