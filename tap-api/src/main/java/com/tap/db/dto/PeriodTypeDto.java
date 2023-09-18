/**
 * Generated DTO class for "PeriodType"
 */
package com.tap.db.dto;
public class PeriodTypeDto {	
	private Integer id;
	private String name;
	private Byte open;
	private String description;
	public PeriodTypeDto() {}

	public PeriodTypeDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public PeriodTypeDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public PeriodTypeDto setOpen( byte open ) {
		this.open = open;
		return this;
	}

	public byte getOpen() {
		return this.open;
	}

	public PeriodTypeDto setDescription( String description ) {
		this.description = description;
		return this;
	}

	public String getDescription() {
		return this.description;
	}

}