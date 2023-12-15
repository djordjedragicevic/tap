/**
 * Generated DTO class for "Employee"
 */
package com.tap.rest.dto;
public class EmployeeDto {	
	private Integer id;
	private String name;
	private String imagePath;
	private ProviderDto provider; 
	private UserDto user; 
	public EmployeeDto() {}

	public EmployeeDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public EmployeeDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public EmployeeDto setImagePath( String imagePath ) {
		this.imagePath = imagePath;
		return this;
	}

	public String getImagePath() {
		return this.imagePath;
	}

	public ProviderDto getProvider() {
		return this.provider;
	}

	public EmployeeDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public EmployeeDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
}