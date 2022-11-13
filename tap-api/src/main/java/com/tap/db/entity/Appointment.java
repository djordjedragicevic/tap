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

	private User employee;

	private User user;

	private CompanyService companyService;

	private LocalDateTime createTime;

	private LocalDateTime startTime;

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
	@JoinColumn(name = "employee_id", nullable = false)
	public User getEmployee() {
		return employee;
	}

	public Appointment setEmployee(User employee) {
		this.employee = employee;
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
	@JoinColumn(name = "company_service_id", nullable = false)
	public CompanyService getCompanyService() {
		return companyService;
	}

	public Appointment setCompanyService(CompanyService companyService) {
		this.companyService = companyService;
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

	@Column(name = "comment", length = 256)
	public String getComment() {
		return comment;
	}

	public Appointment setComment(String comment) {
		this.comment = comment;
		return this;
	}

}