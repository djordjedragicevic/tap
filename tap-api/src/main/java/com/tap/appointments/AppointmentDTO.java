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
	@Override
	public String toString() {
		return "AppointmentDTO{" +
			   "id=" + id +
			   ", employeeId=" + employeeId +
			   ", userId=" + userId +
			   ", createdById=" + createdById +
			   ", serviceId=" + serviceId +
			   ", companyId=" + companyId +
			   ", createTime=" + createTime +
			   ", startTime=" + startTime +
			   ", endTime=" + endTime +
			   ", comment='" + comment + '\'' +
			   '}';
	}
}