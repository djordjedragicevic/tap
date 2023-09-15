/**
 * Generated DTO class for "TokenStatus"
 */
package com.tap.db.dto;
public class TokenStatusDto {	
	private Short id;
	private String name;
	private String description;
	public TokenStatusDto() {}

	public TokenStatusDto setId( Short id ) {
		this.id = id;
		return this;
	}

	public Short getId() {
		return this.id;
	}

	public TokenStatusDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public TokenStatusDto setDescription( String description ) {
		this.description = description;
		return this;
	}

	public String getDescription() {
		return this.description;
	}

}