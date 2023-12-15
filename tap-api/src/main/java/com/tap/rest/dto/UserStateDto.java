/**
 * Generated DTO class for "UserState"
 */
package com.tap.rest.dto;
public class UserStateDto {	
	private Integer id;
	private String favoriteProviders;
	private String language;
	private String theme;
	private String custom;
	public UserStateDto() {}

	public UserStateDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public UserStateDto setFavoriteProviders( String favoriteProviders ) {
		this.favoriteProviders = favoriteProviders;
		return this;
	}

	public String getFavoriteProviders() {
		return this.favoriteProviders;
	}

	public UserStateDto setLanguage( String language ) {
		this.language = language;
		return this;
	}

	public String getLanguage() {
		return this.language;
	}

	public UserStateDto setTheme( String theme ) {
		this.theme = theme;
		return this;
	}

	public String getTheme() {
		return this.theme;
	}

	public UserStateDto setCustom( String custom ) {
		this.custom = custom;
		return this;
	}

	public String getCustom() {
		return this.custom;
	}

}