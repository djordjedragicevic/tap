/**
 * Generated DTO class for "RepeatType"
 */
package com.tap.db.dto;
public class RepeatTypeDto {	
	private Byte id;
	private String name;
	public RepeatTypeDto() {}

	public RepeatTypeDto setId( Byte id ) {
		this.id = id;
		return this;
	}

	public Byte getId() {
		return this.id;
	}

	public RepeatTypeDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

}