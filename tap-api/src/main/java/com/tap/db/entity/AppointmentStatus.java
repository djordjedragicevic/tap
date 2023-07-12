/*
 * Created on 2023-07-13 ( 00:26:02 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
/**
 * JPA entity class for "AppointmentStatus"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="appointment_status", catalog="tap" )
public class AppointmentStatus implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", length=16)
	private String name;


	public AppointmentStatus() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name ;
	}

	public String getName() {
		return this.name;
	}

}