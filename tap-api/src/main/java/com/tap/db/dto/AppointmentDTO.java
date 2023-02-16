package com.tap.db.dto;

import java.time.LocalDateTime;

public class AppointmentDTO {
	private Long id;
	private Long userId;
	private Long employeeServiceId;
	private Long employeeId;
	private Long serviceId;
	private Long createdById;
	private LocalDateTime createIn;
	private LocalDateTime start;
	private LocalDateTime end;
	private String comment;

	public AppointmentDTO(Long id, Long userId, Long employeeServiceId, Long employeeId, Long serviceId, Long createdById, LocalDateTime createIn, LocalDateTime start, LocalDateTime end, String comment) {
		this.id = id;
		this.userId = userId;
		this.employeeServiceId = employeeServiceId;
		this.employeeId = employeeId;
		this.serviceId = serviceId;
		this.createdById = createdById;
		this.createIn = createIn;
		this.start = start;
		this.end = end;
		this.comment = comment;
	}

	public Long getId() {
		return id;
	}

	public Long getUserId() {
		return userId;
	}

	public Long getEmployeeServiceId() {
		return employeeServiceId;
	}

	public Long getEmployeeId() {
		return employeeId;
	}

	public Long getServiceId() {
		return serviceId;
	}

	public Long getCreatedById() {
		return createdById;
	}

	public LocalDateTime getCreateIn() {
		return createIn;
	}

	public LocalDateTime getStart() {
		return start;
	}

	public LocalDateTime getEnd() {
		return end;
	}

	public String getComment() {
		return comment;
	}
}
