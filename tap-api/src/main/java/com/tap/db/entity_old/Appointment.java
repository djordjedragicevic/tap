package com.tap.db.entity_old;

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
	private Employee employee;
	private CompanyService companyService;
	private User user;
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
	@JoinColumn(name = "employee_id", nullable = false)
	public Employee getEmployee() {
		return employee;
	}

	public Appointment setEmployee(Employee employee) {
		this.employee = employee;
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