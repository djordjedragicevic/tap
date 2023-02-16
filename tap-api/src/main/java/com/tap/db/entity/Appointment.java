package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment implements Serializable {
	@Serial
	private static final long serialVersionUID = 8047777733962317152L;

	private Long id;
	private User user;
	private EmployeeService employeeService;
	private User createdBy;
	private LocalDateTime createIn;
	private LocalDateTime start;
	private LocalDateTime end;
	private String comment;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	public Long getId() {
		return id;
	}

	public Appointment setId(Long id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_service_id", nullable = false)
	public EmployeeService getEmployeeService() {
		return employeeService;
	}

	public Appointment setEmployeeService(EmployeeService employeeService) {
		this.employeeService = employeeService;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	public User getUser() {
		return user;
	}

	public Appointment setUser(User user) {
		this.user = user;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "created_by_id", nullable = false)
	public User getCreatedBy() {
		return createdBy;
	}

	public Appointment setCreatedBy(User createdBy) {
		this.createdBy = createdBy;
		return this;
	}

	@Column(name = "create_in", nullable = false)
	public LocalDateTime getCreateIn() {
		return createIn;
	}

	public Appointment setCreateIn(LocalDateTime createIn) {
		this.createIn = createIn;
		return this;
	}

	@Column(name = "start", nullable = false)
	public LocalDateTime getStart() {
		return start;
	}

	public Appointment setStart(LocalDateTime start) {
		this.start = start;
		return this;
	}

	@Column(name = "end", nullable = false)
	public LocalDateTime getEnd() {
		return end;
	}

	public Appointment setEnd(LocalDateTime end) {
		this.end = end;
		return this;
	}

	@Column(name = "comment", length = 256)
	public String getComment() {
		return comment;
	}

	public Appointment setComment(String comment) {
		this.comment = comment;
		return this;
	}

}