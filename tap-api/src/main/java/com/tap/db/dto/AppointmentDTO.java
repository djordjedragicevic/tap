package com.tap.db.dto;

import java.time.LocalDateTime;

public class AppointmentDTO {
	private Long id;
	private Long serviceId;
	private Long companyEmployeeId;
	private Long userId;
	private LocalDateTime createTime;
	private LocalDateTime startTime;
	private LocalDateTime endTime;

	public AppointmentDTO(Long id, Long serviceId, Long companyEmployeeId, Long userId, LocalDateTime createTime, LocalDateTime startTime, LocalDateTime endTime) {
		this.id = id;
		this.serviceId = serviceId;
		this.companyEmployeeId = companyEmployeeId;
		this.userId = userId;
		this.createTime = createTime;
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getServiceId() {
		return serviceId;
	}

	public void setServiceId(Long serviceId) {
		this.serviceId = serviceId;
	}

	public Long getCompanyEmployeeId() {
		return companyEmployeeId;
	}

	public void setCompanyEmployeeId(Long companyEmployeeId) {
		this.companyEmployeeId = companyEmployeeId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public LocalDateTime getCreateTime() {
		return createTime;
	}

	public void setCreateTime(LocalDateTime createTime) {
		this.createTime = createTime;
	}

	public LocalDateTime getStartTime() {
		return startTime;
	}

	public void setStartTime(LocalDateTime startTime) {
		this.startTime = startTime;
	}

	public LocalDateTime getEndTime() {
		return endTime;
	}

	public void setEndTime(LocalDateTime endTime) {
		this.endTime = endTime;
	}

	@Override
	public String toString() {
		return "AppointmentDTO{" +
				"id=" + id +
				", serviceId=" + serviceId +
				", companyEmployeeId=" + companyEmployeeId +
				", userId=" + userId +
				", createTime=" + createTime +
				", startTime=" + startTime +
				", endTime=" + endTime +
				'}';
	}
}
