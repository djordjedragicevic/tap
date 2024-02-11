/**
 * Generated DTO class for "Review"
 */
package com.tap.rest.dto;
import java.time.LocalDateTime;
public class ReviewDto {	
	private Long id;
	private Short mark;
	private String comment;
	private LocalDateTime createdAt;
	private LocalDateTime approvedAt;
	private AppointmentDto appointment; 
	private ProviderDto provider; 
	private UserDto user; 
	private UserDto user2; 
	public ReviewDto() {}

	public ReviewDto setId( Long id ) {
		this.id = id;
		return this;
	}

	public Long getId() {
		return this.id;
	}

	public ReviewDto setMark( short mark ) {
		this.mark = mark;
		return this;
	}

	public short getMark() {
		return this.mark;
	}

	public ReviewDto setComment( String comment ) {
		this.comment = comment;
		return this;
	}

	public String getComment() {
		return this.comment;
	}

	public ReviewDto setCreatedAt( LocalDateTime createdAt ) {
		this.createdAt = createdAt;
		return this;
	}

	public LocalDateTime getCreatedAt() {
		return this.createdAt;
	}

	public ReviewDto setApprovedAt( LocalDateTime approvedAt ) {
		this.approvedAt = approvedAt;
		return this;
	}

	public LocalDateTime getApprovedAt() {
		return this.approvedAt;
	}

	public AppointmentDto getAppointment() {
		return this.appointment;
	}

	public ReviewDto setAppointment(AppointmentDto appointment) {
		this.appointment = appointment;
		return this;
	}
	public ProviderDto getProvider() {
		return this.provider;
	}

	public ReviewDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public ReviewDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
	public UserDto getUser2() {
		return this.user2;
	}

	public ReviewDto setUser2(UserDto user2) {
		this.user2 = user2;
		return this;
	}
}