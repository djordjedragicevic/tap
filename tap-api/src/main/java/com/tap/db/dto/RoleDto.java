/**
 * Generated DTO class for "Role"
 */
package com.tap.db.dto;
public class RoleDto {	
	private Byte id;
	private String name;
	public RoleDto() {}

	public RoleDto setId( Byte id ) {
		this.id = id;
		return this;
	}

	public Byte getId() {
		return this.id;
	}

	public RoleDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

}