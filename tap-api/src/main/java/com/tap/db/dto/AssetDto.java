/**
 * Generated DTO class for "Asset"
 */
package com.tap.db.dto;
public class AssetDto {	
	private Integer id;
	private String location;
	private AssetTypeDto assettype; 
	private ProviderDto provider; 
	public AssetDto() {}

	public AssetDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
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
	public ProviderDto getProvider() {
		return this.provider;
	}

	public AssetDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
}