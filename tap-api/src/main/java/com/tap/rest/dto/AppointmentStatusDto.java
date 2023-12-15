/**
 * Generated DTO class for "AppointmentStatus"
 */
package com.tap.rest.dto;
public class AppointmentStatusDto {	
	private Integer id;
	private String name;
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

}