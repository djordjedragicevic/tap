/**
 * Generated JPA entity class for "Appointment"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="appointment", catalog="tap" )
public class Appointment implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private long id;

    @Column(name="join_id", length=65535)
	private String joinId;

    @Column(name="start", nullable=false)
	private LocalDateTime start;

    @Column(name="end", nullable=false)
	private LocalDateTime end;

    @Column(name="created_at", nullable=false)
	private LocalDateTime createdAt;

    @Column(name="comment", length=256)
	private String comment;

    @Column(name="status_comment", length=256)
	private String statusComment;

    @Column(name="status_updated_at")
	private LocalDateTime statusUpdatedAt;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="appointment_status_id", referencedColumnName="id")
	private AppointmentStatus appointmentstatus; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id")
	private Employee employee; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="period_type_id", referencedColumnName="id")
	private PeriodType periodtype; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="service_id", referencedColumnName="id")
	private Service service; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", referencedColumnName="id")
	private User user; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="created_by_id", referencedColumnName="id")
	private User user2; 

    @OneToMany(mappedBy="appointment")
	@JsonbTransient
	private List<StatusHistory> statushistoryList; 

	public Appointment() {
		super();
	}
	
	public void setId( long id ) {
		this.id = id;
	}

	public long getId() {
		return this.id;
	}

	public void setJoinId( String joinId ) {
		this.joinId = joinId;
	}

	public String getJoinId() {
		return this.joinId;
	}

	public void setStart( LocalDateTime start ) {
		this.start = start;
	}

	public LocalDateTime getStart() {
		return this.start;
	}

	public void setEnd( LocalDateTime end ) {
		this.end = end;
	}

	public LocalDateTime getEnd() {
		return this.end;
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

	public void setStatusComment( String statusComment ) {
		this.statusComment = statusComment;
	}

	public String getStatusComment() {
		return this.statusComment;
	}

	public void setStatusUpdatedAt( LocalDateTime statusUpdatedAt ) {
		this.statusUpdatedAt = statusUpdatedAt;
	}

	public LocalDateTime getStatusUpdatedAt() {
		return this.statusUpdatedAt;
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
	public PeriodType getPeriodtype() {
		return this.periodtype;
	}
	
	public void setPeriodtype(PeriodType periodtype) {
		this.periodtype = periodtype;
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
	public List<StatusHistory> getStatushistoryList() {
		return this.statushistoryList;
	}
	
	public void setStatushistoryList(List<StatusHistory> statushistoryList) {
		this.statushistoryList = statushistoryList;
	}
}