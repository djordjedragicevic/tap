/**
 * Generated JPA entity class for "AppointmentStatus"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

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


    @OneToMany(mappedBy="appointmentstatus")
	@JsonbTransient
	private List<Appointment> appointmentList; 

	public AppointmentStatus() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id;
	}

	public int getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public List<Appointment> getAppointmentList() {
		return this.appointmentList;
	}
	
	public void setAppointmentList(List<Appointment> appointmentList) {
		this.appointmentList = appointmentList;
	}
}