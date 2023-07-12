/*
 * Created on 2023-07-13 ( 00:26:02 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
/**
 * JPA entity class for "AppointmentType"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="appointment_type", catalog="tap" )
public class AppointmentType implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private byte id;

    @Column(name="name", nullable=false, length=32)
	private String name;

    @Column(name="active", nullable=false)
	private boolean active;


	public AppointmentType() {
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

	public void setActive( boolean active ) {
		this.active = active ;
	}

	public boolean isActive() {
		return this.active;
	}

}