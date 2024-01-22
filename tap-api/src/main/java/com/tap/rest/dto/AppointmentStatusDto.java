/**
 * Generated DTO class for "AppointmentStatus"
 */
package com.tap.rest.dto;
public class AppointmentStatusDto {	
	private Integer id;
	private String name;
	private Boolean userSide;
	public AppointmentStatusDto() {}

	public AppointmentStatusDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public AppointmentStatusDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public AppointmentStatusDto setUserSide( boolean userSide ) {
		this.userSide = userSide;
		return this;
	}

	public boolean isUserSide() {
		return this.userSide;
	}

}