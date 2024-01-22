/**
 * Generated DTO class for "StatusHistory"
 */
package com.tap.rest.dto;
import java.time.LocalDateTime;
public class StatusHistoryDto {	
	private Long id;
	private LocalDateTime createdAt;
	private String comment;
	private AppointmentDto appointment; 
	private AppointmentStatusDto appointmentstatus; 
	public StatusHistoryDto() {}

	public StatusHistoryDto setId( Long id ) {
		this.id = id;
		return this;
	}

	public Long getId() {
		return this.id;
	}

	public StatusHistoryDto setCreatedAt( LocalDateTime createdAt ) {
		this.createdAt = createdAt;
		return this;
	}

	public LocalDateTime getCreatedAt() {
		return this.createdAt;
	}

	public StatusHistoryDto setComment( String comment ) {
		this.comment = comment;
		return this;
	}

	public String getComment() {
		return this.comment;
	}

	public AppointmentDto getAppointment() {
		return this.appointment;
	}

	public StatusHistoryDto setAppointment(AppointmentDto appointment) {
		this.appointment = appointment;
		return this;
	}
	public AppointmentStatusDto getAppointmentstatus() {
		return this.appointmentstatus;
	}

	public StatusHistoryDto setAppointmentstatus(AppointmentStatusDto appointmentstatus) {
		this.appointmentstatus = appointmentstatus;
		return this;
	}
}