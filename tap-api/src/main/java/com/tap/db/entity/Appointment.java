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

	private Service service;

	private Company company;

	private User user;

	private Employee employee;

	private User createdBy;

	private LocalDateTime createTime;

	private LocalDateTime startTime;

	private LocalDateTime endTime;

	private String comment;

	@Id
	@Column(name = "id", nullable = false)
	public Long getId() {
		return id;
	}

	public Appointment setId(Long id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "service_id", nullable = false)
	public Service getService() {
		return service;
	}

	public Appointment setService(Service service) {
		this.service = service;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_id", nullable = false)
	public Company getCompany() {
		return company;
	}

	public Appointment setCompany(Company company) {
		this.company = company;
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

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	public Employee getEmployee() {
		return employee;
	}

	public Appointment setEmployee(Employee employee) {
		this.employee = employee;
		return this;
	}

	@Column(name = "create_time", nullable = false)
	public LocalDateTime getCreateTime() {
		return createTime;
	}

	public Appointment setCreateTime(LocalDateTime createTime) {
		this.createTime = createTime;
		return this;
	}

	@Column(name = "start_time", nullable = false)
	public LocalDateTime getStartTime() {
		return startTime;
	}

	public Appointment setStartTime(LocalDateTime startTime) {
		this.startTime = startTime;
		return this;
	}

	@Column(name = "end_time", nullable = false)
	public LocalDateTime getEndTime() {
		return endTime;
	}

	public Appointment setEndTime(LocalDateTime endTime) {
		this.endTime = endTime;
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