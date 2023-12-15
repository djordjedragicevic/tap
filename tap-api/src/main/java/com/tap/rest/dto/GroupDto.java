/**
 * Generated DTO class for "Group"
 */
package com.tap.rest.dto;
public class GroupDto {	
	private Integer id;
	private String name;
	public GroupDto() {}

	public GroupDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public GroupDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

}