/**
 * Generated DTO class for "User"
 */
package com.tap.rest.dto;
import java.time.LocalDateTime;
public class UserDto {	
	private Integer id;
	private String username;
	private String email;
	private String password;
	private String salt;
	private String firstName;
	private String lastName;
	private String phone;
	private String imgpath;
	private LocalDateTime createDate;
	private LocalDateTime lastLogin;
	private Byte verified;
	private AddressDto address; 
	private UserStateDto userstate; 
	public UserDto() {}

	public UserDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public UserDto setUsername( String username ) {
		this.username = username;
		return this;
	}

	public String getUsername() {
		return this.username;
	}

	public UserDto setEmail( String email ) {
		this.email = email;
		return this;
	}

	public String getEmail() {
		return this.email;
	}

	public UserDto setPassword( String password ) {
		this.password = password;
		return this;
	}

	public String getPassword() {
		return this.password;
	}

	public UserDto setSalt( String salt ) {
		this.salt = salt;
		return this;
	}

	public String getSalt() {
		return this.salt;
	}

	public UserDto setFirstName( String firstName ) {
		this.firstName = firstName;
		return this;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public UserDto setLastName( String lastName ) {
		this.lastName = lastName;
		return this;
	}

	public String getLastName() {
		return this.lastName;
	}

	public UserDto setPhone( String phone ) {
		this.phone = phone;
		return this;
	}

	public String getPhone() {
		return this.phone;
	}

	public UserDto setImgpath( String imgpath ) {
		this.imgpath = imgpath;
		return this;
	}

	public String getImgpath() {
		return this.imgpath;
	}

	public UserDto setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate;
		return this;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public UserDto setLastLogin( LocalDateTime lastLogin ) {
		this.lastLogin = lastLogin;
		return this;
	}

	public LocalDateTime getLastLogin() {
		return this.lastLogin;
	}

	public UserDto setVerified( byte verified ) {
		this.verified = verified;
		return this;
	}

	public byte getVerified() {
		return this.verified;
	}

	public AddressDto getAddress() {
		return this.address;
	}

	public UserDto setAddress(AddressDto address) {
		this.address = address;
		return this;
	}
	public UserStateDto getUserstate() {
		return this.userstate;
	}

	public UserDto setUserstate(UserStateDto userstate) {
		this.userstate = userstate;
		return this;
	}
}