/**
 * Generated DTO class for "ProviderType"
 */
package com.tap.db.dto;
public class ProviderTypeDto {	
	private Short id;
	private String name;
	private String description;
	public ProviderTypeDto() {}

	public ProviderTypeDto setId( Short id ) {
		this.id = id;
		return this;
	}

	public Short getId() {
		return this.id;
	}

	public ProviderTypeDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public ProviderTypeDto setDescription( String description ) {
		this.description = description;
		return this;
	}

	public String getDescription() {
		return this.description;
	}

}