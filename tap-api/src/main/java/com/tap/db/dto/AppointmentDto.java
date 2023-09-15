/**
 * Generated DTO class for "Appointment"
 */
package com.tap.db.dto;
import java.time.LocalDateTime;
public class AppointmentDto {	
	private Long id;
	private LocalDateTime start;
	private LocalDateTime end;
	private LocalDateTime createDate;
	private LocalDateTime statusResponseDate;
	private String comment;
	private AppointmentStatusDto appointmentstatus; 
	private EmployeeDto employee; 
	private ServiceDto service; 
	private UserDto user; 
	private UserDto user2; 
	public AppointmentDto() {}

	public AppointmentDto setId( Long id ) {
		this.id = id;
		return this;
	}

	public Long getId() {
		return this.id;
	}

	public AppointmentDto setStart( LocalDateTime start ) {
		this.start = start;
		return this;
	}

	public LocalDateTime getStart() {
		return this.start;
	}

	public AppointmentDto setEnd( LocalDateTime end ) {
		this.end = end;
		return this;
	}

	public LocalDateTime getEnd() {
		return this.end;
	}

	public AppointmentDto setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate;
		return this;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public AppointmentDto setStatusResponseDate( LocalDateTime statusResponseDate ) {
		this.statusResponseDate = statusResponseDate;
		return this;
	}

	public LocalDateTime getStatusResponseDate() {
		return this.statusResponseDate;
	}

	public AppointmentDto setComment( String comment ) {
		this.comment = comment;
		return this;
	}

	public String getComment() {
		return this.comment;
	}

	public AppointmentStatusDto getAppointmentstatus() {
		return this.appointmentstatus;
	}

	public AppointmentDto setAppointmentstatus(AppointmentStatusDto appointmentstatus) {
		this.appointmentstatus = appointmentstatus;
		return this;
	}
	public EmployeeDto getEmployee() {
		return this.employee;
	}

	public AppointmentDto setEmployee(EmployeeDto employee) {
		this.employee = employee;
		return this;
	}
	public ServiceDto getService() {
		return this.service;
	}

	public AppointmentDto setService(ServiceDto service) {
		this.service = service;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public AppointmentDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
	public UserDto getUser2() {
		return this.user2;
	}

	public AppointmentDto setUser2(UserDto user2) {
		this.user2 = user2;
		return this;
	}
}