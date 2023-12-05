/**
 * Generated DTO class for "Token"
 */
package com.tap.db.dto;
public class TokenDto {	
	private Long id;
	private String jti;
	private String token;
	private TokenStatusDto tokenstatus; 
	private UserDto user; 
	public TokenDto() {}

	public TokenDto setId( Long id ) {
		this.id = id;
		return this;
	}

	public Long getId() {
		return this.id;
	}

	public TokenDto setJti( String jti ) {
		this.jti = jti;
		return this;
	}

	public String getJti() {
		return this.jti;
	}

	public TokenDto setToken( String token ) {
		this.token = token;
		return this;
	}

	public String getToken() {
		return this.token;
	}

	public TokenStatusDto getTokenstatus() {
		return this.tokenstatus;
	}

	public TokenDto setTokenstatus(TokenStatusDto tokenstatus) {
		this.tokenstatus = tokenstatus;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public TokenDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
}