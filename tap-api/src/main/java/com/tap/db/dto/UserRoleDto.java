/**
 * Generated DTO class for "UserRole"
 */
package com.tap.db.dto;
public class UserRoleDto {	
	private Integer id;
	private RoleDto role; 
	private UserDto user; 
	public UserRoleDto() {}

	public UserRoleDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public RoleDto getRole() {
		return this.role;
	}

	public UserRoleDto setRole(RoleDto role) {
		this.role = role;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public UserRoleDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
}