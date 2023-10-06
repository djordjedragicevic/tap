/**
 * Generated DTO class for "AppConfig"
 */
package com.tap.db.dto;
public class AppConfigDto {	
	private Byte id;
	private String name;
	private String value;
	private Byte level;
	public AppConfigDto() {}

	public AppConfigDto setId( Byte id ) {
		this.id = id;
		return this;
	}

	public Byte getId() {
		return this.id;
	}

	public AppConfigDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public AppConfigDto setValue( String value ) {
		this.value = value;
		return this;
	}

	public String getValue() {
		return this.value;
	}

	public AppConfigDto setLevel( byte level ) {
		this.level = level;
		return this;
	}

	public byte getLevel() {
		return this.level;
	}

}