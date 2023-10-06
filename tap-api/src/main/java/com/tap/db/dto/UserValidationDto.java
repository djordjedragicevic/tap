/**
 * Generated DTO class for "UserValidation"
 */
package com.tap.db.dto;
import java.time.LocalDateTime;
public class UserValidationDto {	
	private Integer id;
	private String code;
	private LocalDateTime createTime;
	private LocalDateTime expireTime;
	private UserDto user; 
	public UserValidationDto() {}

	public UserValidationDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public UserValidationDto setCode( String code ) {
		this.code = code;
		return this;
	}

	public String getCode() {
		return this.code;
	}

	public UserValidationDto setCreateTime( LocalDateTime createTime ) {
		this.createTime = createTime;
		return this;
	}

	public LocalDateTime getCreateTime() {
		return this.createTime;
	}

	public UserValidationDto setExpireTime( LocalDateTime expireTime ) {
		this.expireTime = expireTime;
		return this;
	}

	public LocalDateTime getExpireTime() {
		return this.expireTime;
	}

	public UserDto getUser() {
		return this.user;
	}

	public UserValidationDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
}