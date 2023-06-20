/*
 * Created on 2023-06-20 ( 07:13:26 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;

/**
 * JPA entity class for "AppointmentStatus"
 *
 * @author Telosys
 *
 */
@Entity
@Table(name="appointment_status", catalog="tap" )
public class AppointmentStatus implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

	//--- ENTITY PRIMARY KEY 
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id ;

	//--- ENTITY DATA FIELDS 
    @Column(name="name", length=16)
	private String name ;


	//--- ENTITY LINKS ( RELATIONSHIP )
    @OneToMany(mappedBy="appointmentstatus")
	private List<Appointment> appointmentList ; 


	/**
	 * Constructor
	 */
	public AppointmentStatus() {
		super();
	}
	
	//--- GETTERS & SETTERS FOR FIELDS
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

	//--- GETTERS FOR LINKS
	public List<Appointment> getAppointmentList() {
		return this.appointmentList;
	} 

	//--- toString specific method
	@Override
 public String toString() { 
  StringBuilder sb = new StringBuilder(); 
  sb.append(id);
  sb.append("|");
  sb.append(name);
  return sb.toString(); 
 } 

}