/**
 * Generated JPA entity class for "StatusHistory"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;

@Entity
@Table(name="status_history", catalog="tap" )
public class StatusHistory implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private long id;

    @Column(name="created_at", nullable=false)
	private LocalDateTime createdAt;

    @Column(name="comment", length=65535)
	private String comment;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="appointment_id", referencedColumnName="id")
	private Appointment appointment; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="appointment_status_id", referencedColumnName="id")
	private AppointmentStatus appointmentstatus; 

	public StatusHistory() {
		super();
	}
	
	public void setId( long id ) {
		this.id = id;
	}

	public long getId() {
		return this.id;
	}

	public void setCreatedAt( LocalDateTime createdAt ) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getCreatedAt() {
		return this.createdAt;
	}

	public void setComment( String comment ) {
		this.comment = comment;
	}

	public String getComment() {
		return this.comment;
	}

	public Appointment getAppointment() {
		return this.appointment;
	}
	
	public void setAppointment(Appointment appointment) {
		this.appointment = appointment;
	}
	public AppointmentStatus getAppointmentstatus() {
		return this.appointmentstatus;
	}
	
	public void setAppointmentstatus(AppointmentStatus appointmentstatus) {
		this.appointmentstatus = appointmentstatus;
	}
}