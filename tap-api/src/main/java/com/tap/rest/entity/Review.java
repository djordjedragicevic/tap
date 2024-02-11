/**
 * Generated JPA entity class for "Review"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;

@Entity
@Table(name="review", catalog="tap" )
public class Review implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private long id;

    @Column(name="mark", nullable=false)
	private short mark;

    @Column(name="comment", length=256)
	private String comment;

    @Column(name="created_at", nullable=false)
	private LocalDateTime createdAt;

    @Column(name="approved_at")
	private LocalDateTime approvedAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="appointment_id", referencedColumnName="id")
	private Appointment appointment; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_id", referencedColumnName="id")
	private Provider provider; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", referencedColumnName="id")
	private User user; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="approved_by", referencedColumnName="id")
	private User user2; 

	public Review() {
		super();
	}
	
	public void setId( long id ) {
		this.id = id;
	}

	public long getId() {
		return this.id;
	}

	public void setMark( short mark ) {
		this.mark = mark;
	}

	public short getMark() {
		return this.mark;
	}

	public void setComment( String comment ) {
		this.comment = comment;
	}

	public String getComment() {
		return this.comment;
	}

	public void setCreatedAt( LocalDateTime createdAt ) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getCreatedAt() {
		return this.createdAt;
	}

	public void setApprovedAt( LocalDateTime approvedAt ) {
		this.approvedAt = approvedAt;
	}

	public LocalDateTime getApprovedAt() {
		return this.approvedAt;
	}

	public Appointment getAppointment() {
		return this.appointment;
	}
	
	public void setAppointment(Appointment appointment) {
		this.appointment = appointment;
	}
	public Provider getProvider() {
		return this.provider;
	}
	
	public void setProvider(Provider provider) {
		this.provider = provider;
	}
	public User getUser() {
		return this.user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	public User getUser2() {
		return this.user2;
	}
	
	public void setUser2(User user2) {
		this.user2 = user2;
	}
}