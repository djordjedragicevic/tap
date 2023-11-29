/**
 * Generated JPA entity class for "Appointment"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="appointment", catalog="tap" )
public class Appointment implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private long id;

    @Column(name="start", nullable=false)
	private LocalDateTime start;

    @Column(name="end", nullable=false)
	private LocalDateTime end;

    @Column(name="user_name", length=32)
	private String userName;

    @Column(name="create_date", nullable=false)
	private LocalDateTime createDate;

    @Column(name="join_id", length=64)
	private String joinId;

    @Column(name="status_response_date")
	private LocalDateTime statusResponseDate;

    @Column(name="comment", length=65535)
	private String comment;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="appointment_status_id", referencedColumnName="id")
	private AppointmentStatus appointmentstatus ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id")
	private Employee employee ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="service_id", referencedColumnName="id")
	private Service service ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", referencedColumnName="id")
	private User user ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="created_by_id", referencedColumnName="id")
	private User user2 ; 

	public Appointment() {
		super();
	}
	
	public void setId( long id ) {
		this.id = id ;
	}

	public long getId() {
		return this.id;
	}

	public void setStart( LocalDateTime start ) {
		this.start = start ;
	}

	public LocalDateTime getStart() {
		return this.start;
	}

	public void setEnd( LocalDateTime end ) {
		this.end = end ;
	}

	public LocalDateTime getEnd() {
		return this.end;
	}

	public void setUserName( String userName ) {
		this.userName = userName ;
	}

	public String getUserName() {
		return this.userName;
	}

	public void setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate ;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public void setJoinId( String joinId ) {
		this.joinId = joinId ;
	}

	public String getJoinId() {
		return this.joinId;
	}

	public void setStatusResponseDate( LocalDateTime statusResponseDate ) {
		this.statusResponseDate = statusResponseDate ;
	}

	public LocalDateTime getStatusResponseDate() {
		return this.statusResponseDate;
	}

	public void setComment( String comment ) {
		this.comment = comment ;
	}

	public String getComment() {
		return this.comment;
	}

	public AppointmentStatus getAppointmentstatus() {
		return this.appointmentstatus;
	}
	
	public void setAppointmentstatus(AppointmentStatus appointmentstatus) {
		this.appointmentstatus = appointmentstatus;
	}
	public Employee getEmployee() {
		return this.employee;
	}
	
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	public Service getService() {
		return this.service;
	}
	
	public void setService(Service service) {
		this.service = service;
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