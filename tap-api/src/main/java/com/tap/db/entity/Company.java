package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
public class Company implements Serializable {
	private static final long serialVersionUID = -219379721256924057L;
	private Long id;

	private String name;

	private CompanyType companyType;

	private Address address;

	private String description;

	private String phone;

	private String ein;

	private Byte approved;

	private User approvedBy;

	private LocalDateTime approvedDate;

	private Byte active;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_type_id", nullable = false)
	public CompanyType getCompanyType() {
		return companyType;
	}

	public void setCompanyType(CompanyType companyType) {
		this.companyType = companyType;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "address_id", nullable = false)
	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	@Column(name = "description", length = 512)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "phone", length = 16)
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "ein", nullable = false, length = 32)
	public String getEin() {
		return ein;
	}

	public void setEin(String ein) {
		this.ein = ein;
	}

	@Column(name = "approved", nullable = false)
	public Byte getApproved() {
		return approved;
	}

	public void setApproved(Byte approved) {
		this.approved = approved;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "approved_by", nullable = false)
	public User getApprovedBy() {
		return approvedBy;
	}

	public void setApprovedBy(User approvedBy) {
		this.approvedBy = approvedBy;
	}

	@Column(name = "approved_date", nullable = false)
	public LocalDateTime getApprovedDate() {
		return approvedDate;
	}

	public void setApprovedDate(LocalDateTime approvedDate) {
		this.approvedDate = approvedDate;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public void setActive(Byte active) {
		this.active = active;
	}

}