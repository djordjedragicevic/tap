package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
public class Company implements Serializable {
	@Serial
	private static final long serialVersionUID = 5074070342066930656L;
	private Long id;

	private String name;

	private String typeName;

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
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public Company setId(Long id) {
		this.id = id;
		return this;
	}

	@Column(name = "name", nullable = false, length = 64)
	public String getName() {
		return name;
	}

	public Company setName(String name) {
		this.name = name;
		return this;
	}

	@Column(name = "type_name", length = 128)
	public String getTypeName() {
		return typeName;
	}

	public Company setTypeName(String typeName) {
		this.typeName = typeName;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_type_id", nullable = false)
	public CompanyType getCompanyType() {
		return companyType;
	}

	public Company setCompanyType(CompanyType companyType) {
		this.companyType = companyType;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "address_id", nullable = false)
	public Address getAddress() {
		return address;
	}

	public Company setAddress(Address address) {
		this.address = address;
		return this;
	}

	@Column(name = "description", length = 512)
	public String getDescription() {
		return description;
	}

	public Company setDescription(String description) {
		this.description = description;
		return this;
	}

	@Column(name = "phone", length = 16)
	public String getPhone() {
		return phone;
	}

	public Company setPhone(String phone) {
		this.phone = phone;
		return this;
	}

	@Column(name = "ein", nullable = false, length = 32)
	public String getEin() {
		return ein;
	}

	public Company setEin(String ein) {
		this.ein = ein;
		return this;
	}

	@Column(name = "approved", nullable = false)
	public Byte getApproved() {
		return approved;
	}

	public Company setApproved(Byte approved) {
		this.approved = approved;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "approved_by", nullable = false)
	public User getApprovedBy() {
		return approvedBy;
	}

	public Company setApprovedBy(User approvedBy) {
		this.approvedBy = approvedBy;
		return this;
	}

	@Column(name = "approved_date", nullable = false)
	public LocalDateTime getApprovedDate() {
		return approvedDate;
	}

	public Company setApprovedDate(LocalDateTime approvedDate) {
		this.approvedDate = approvedDate;

		return this;
	}

	@Column(name = "active", nullable = false)
	public Byte getActive() {
		return active;
	}

	public Company setActive(Byte active) {
		this.active = active;
		return this;
	}

}