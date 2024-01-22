/**
 * Generated DTO class for "Appointment"
 */
package com.tap.rest.dto;
import java.time.LocalDateTime;
public class AppointmentDto {	
	private Long id;
	private String joinId;
	private LocalDateTime start;
	private LocalDateTime end;
	private LocalDateTime createdAt;
	private String comment;
	private String statusComment;
	private LocalDateTime statusUpdatedAt;
	private AppointmentStatusDto appointmentstatus; 
	private EmployeeDto employee; 
	private PeriodTypeDto periodtype; 
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

	public AppointmentDto setJoinId( String joinId ) {
		this.joinId = joinId;
		return this;
	}

	public String getJoinId() {
		return this.joinId;
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

	public AppointmentDto setCreatedAt( LocalDateTime createdAt ) {
		this.createdAt = createdAt;
		return this;
	}

	public LocalDateTime getCreatedAt() {
		return this.createdAt;
	}

	public AppointmentDto setComment( String comment ) {
		this.comment = comment;
		return this;
	}

	public String getComment() {
		return this.comment;
	}

	public AppointmentDto setStatusComment( String statusComment ) {
		this.statusComment = statusComment;
		return this;
	}

	public String getStatusComment() {
		return this.statusComment;
	}

	public AppointmentDto setStatusUpdatedAt( LocalDateTime statusUpdatedAt ) {
		this.statusUpdatedAt = statusUpdatedAt;
		return this;
	}

	public LocalDateTime getStatusUpdatedAt() {
		return this.statusUpdatedAt;
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
	public PeriodTypeDto getPeriodtype() {
		return this.periodtype;
	}

	public AppointmentDto setPeriodtype(PeriodTypeDto periodtype) {
		this.periodtype = periodtype;
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