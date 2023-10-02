/**
 * Generated JPA entity class for "Provider"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="provider", catalog="tap" )
public class Provider implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", nullable=false, length=64)
	private String name;

    @Column(name="description", length=512)
	private String description;

    @Column(name="id_number", nullable=false, length=32)
	private String idNumber;

    @Column(name="legal_entity", nullable=false)
	private byte legalEntity;

    @Column(name="approved", nullable=false)
	private byte approved;

    @Column(name="approved_date")
	private LocalDateTime approvedDate;

    @Column(name="approved_by")
	private Integer approvedBy;

    @Column(name="mark")
	private Float mark;

    @Column(name="review_count")
	private Integer reviewCount;

    @Column(name="active", nullable=false)
	private byte active;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="address_id", referencedColumnName="id")
	private Address address ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_type_id", referencedColumnName="id")
	private ProviderType providertype ; 

	public Provider() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name ;
	}

	public String getName() {
		return this.name;
	}

	public void setDescription( String description ) {
		this.description = description ;
	}

	public String getDescription() {
		return this.description;
	}

	public void setIdNumber( String idNumber ) {
		this.idNumber = idNumber ;
	}

	public String getIdNumber() {
		return this.idNumber;
	}

	public void setLegalEntity( byte legalEntity ) {
		this.legalEntity = legalEntity ;
	}

	public byte getLegalEntity() {
		return this.legalEntity;
	}

	public void setApproved( byte approved ) {
		this.approved = approved ;
	}

	public byte getApproved() {
		return this.approved;
	}

	public void setApprovedDate( LocalDateTime approvedDate ) {
		this.approvedDate = approvedDate ;
	}

	public LocalDateTime getApprovedDate() {
		return this.approvedDate;
	}

	public void setApprovedBy( Integer approvedBy ) {
		this.approvedBy = approvedBy ;
	}

	public Integer getApprovedBy() {
		return this.approvedBy;
	}

	public void setMark( Float mark ) {
		this.mark = mark ;
	}

	public Float getMark() {
		return this.mark;
	}

	public void setReviewCount( Integer reviewCount ) {
		this.reviewCount = reviewCount ;
	}

	public Integer getReviewCount() {
		return this.reviewCount;
	}

	public void setActive( byte active ) {
		this.active = active ;
	}

	public byte getActive() {
		return this.active;
	}

	public Address getAddress() {
		return this.address;
	}
	
	public void setAddress(Address address) {
		this.address = address;
	}
	public ProviderType getProvidertype() {
		return this.providertype;
	}
	
	public void setProvidertype(ProviderType providertype) {
		this.providertype = providertype;
	}
}