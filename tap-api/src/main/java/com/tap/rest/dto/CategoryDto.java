/**
 * Generated DTO class for "Category"
 */
package com.tap.rest.dto;
public class CategoryDto {	
	private Integer id;
	private String name;
	public CategoryDto() {}

	public CategoryDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public CategoryDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

}