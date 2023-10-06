/**
 * Generated JPA entity class for "AppConfig"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="app_config", catalog="tap" )
public class AppConfig implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private byte id;

    @Column(name="name", nullable=false, length=32)
	private String name;

    @Column(name="value", nullable=false, length=65535)
	private String value;

    @Column(name="level", nullable=false)
	private byte level;


	public AppConfig() {
		super();
	}
	
	public void setId( byte id ) {
		this.id = id ;
	}

	public byte getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name ;
	}

	public String getName() {
		return this.name;
	}

	public void setValue( String value ) {
		this.value = value ;
	}

	public String getValue() {
		return this.value;
	}

	public void setLevel( byte level ) {
		this.level = level ;
	}

	public byte getLevel() {
		return this.level;
	}

}