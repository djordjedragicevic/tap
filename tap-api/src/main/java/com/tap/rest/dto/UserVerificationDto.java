/**
 * Generated DTO class for "UserVerification"
 */
package com.tap.rest.dto;
import java.time.LocalDateTime;
public class UserVerificationDto {	
	private Integer id;
	private String code;
	private LocalDateTime createTime;
	private LocalDateTime expireTime;
	private LocalDateTime validateTime;
	private Byte codeVersion;
	private UserDto user; 
	public UserVerificationDto() {}

	public UserVerificationDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public UserVerificationDto setCode( String code ) {
		this.code = code;
		return this;
	}

	public String getCode() {
		return this.code;
	}

	public UserVerificationDto setCreateTime( LocalDateTime createTime ) {
		this.createTime = createTime;
		return this;
	}

	public LocalDateTime getCreateTime() {
		return this.createTime;
	}

	public UserVerificationDto setExpireTime( LocalDateTime expireTime ) {
		this.expireTime = expireTime;
		return this;
	}

	public LocalDateTime getExpireTime() {
		return this.expireTime;
	}

	public UserVerificationDto setValidateTime( LocalDateTime validateTime ) {
		this.validateTime = validateTime;
		return this;
	}

	public LocalDateTime getValidateTime() {
		return this.validateTime;
	}

	public UserVerificationDto setCodeVersion( byte codeVersion ) {
		this.codeVersion = codeVersion;
		return this;
	}

	public byte getCodeVersion() {
		return this.codeVersion;
	}

	public UserDto getUser() {
		return this.user;
	}

	public UserVerificationDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
}