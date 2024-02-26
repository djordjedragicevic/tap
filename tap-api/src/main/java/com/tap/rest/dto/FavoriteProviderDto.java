/**
 * Generated DTO class for "FavoriteProvider"
 */
package com.tap.rest.dto;
public class FavoriteProviderDto {	
	private Long id;
	private ProviderDto provider; 
	private UserDto user; 
	public FavoriteProviderDto() {}

	public FavoriteProviderDto setId( Long id ) {
		this.id = id;
		return this;
	}

	public Long getId() {
		return this.id;
	}

	public ProviderDto getProvider() {
		return this.provider;
	}

	public FavoriteProviderDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public FavoriteProviderDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
}