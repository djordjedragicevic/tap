/**
 * Generated DTO class for "Asset"
 */
package com.tap.db.dto;
public class AssetDto {	
	private Integer id;
	private Long entityIdentifier;
	private String location;
	private AssetTypeDto assettype; 
	public AssetDto() {}

	public AssetDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public AssetDto setEntityIdentifier( long entityIdentifier ) {
		this.entityIdentifier = entityIdentifier;
		return this;
	}

	public long getEntityIdentifier() {
		return this.entityIdentifier;
	}

	public AssetDto setLocation( String location ) {
		this.location = location;
		return this;
	}

	public String getLocation() {
		return this.location;
	}

	public AssetTypeDto getAssettype() {
		return this.assettype;
	}

	public AssetDto setAssettype(AssetTypeDto assettype) {
		this.assettype = assettype;
		return this;
	}
}