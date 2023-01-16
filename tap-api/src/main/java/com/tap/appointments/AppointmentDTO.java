package com.tap.appointments;

import java.time.LocalDateTime;

public record AppointmentDTO(Long id,
							 Long employeeId,
							 Long userId,
							 Long createdById,
							 Long serviceId,
							 Long companyId,
							 LocalDateTime createTime,
							 LocalDateTime startTime,
							 LocalDateTime endTime,
							 String comment) {
}