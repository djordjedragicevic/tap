/**
 * Generated DTO class for "AssetType"
 */
package com.tap.db.dto;
public class AssetTypeDto {	
	private Short id;
	private String name;
	public AssetTypeDto() {}

	public AssetTypeDto setId( Short id ) {
		this.id = id;
		return this;
	}

	public Short getId() {
		return this.id;
	}

	public AssetTypeDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

}