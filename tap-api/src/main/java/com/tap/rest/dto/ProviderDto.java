/**
 * Generated DTO class for "Provider"
 */
package com.tap.rest.dto;
import java.time.LocalDateTime;
public class ProviderDto {	
	private Integer id;
	private String name;
	private String description;
	private String phone;
	private String imagePath;
	private String idNumber;
	private Byte legalEntity;
	private Byte approved;
	private LocalDateTime approvedDate;
	private Integer approvedBy;
	private Float mark;
	private Integer reviewCount;
	private AddressDto address; 
	private ProviderTypeDto providertype; 
	public ProviderDto() {}

	public ProviderDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public ProviderDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public ProviderDto setDescription( String description ) {
		this.description = description;
		return this;
	}

	public String getDescription() {
		return this.description;
	}

	public ProviderDto setPhone( String phone ) {
		this.phone = phone;
		return this;
	}

	public String getPhone() {
		return this.phone;
	}

	public ProviderDto setImagePath( String imagePath ) {
		this.imagePath = imagePath;
		return this;
	}

	public String getImagePath() {
		return this.imagePath;
	}

	public ProviderDto setIdNumber( String idNumber ) {
		this.idNumber = idNumber;
		return this;
	}

	public String getIdNumber() {
		return this.idNumber;
	}

	public ProviderDto setLegalEntity( byte legalEntity ) {
		this.legalEntity = legalEntity;
		return this;
	}

	public byte getLegalEntity() {
		return this.legalEntity;
	}

	public ProviderDto setApproved( byte approved ) {
		this.approved = approved;
		return this;
	}

	public byte getApproved() {
		return this.approved;
	}

	public ProviderDto setApprovedDate( LocalDateTime approvedDate ) {
		this.approvedDate = approvedDate;
		return this;
	}

	public LocalDateTime getApprovedDate() {
		return this.approvedDate;
	}

	public ProviderDto setApprovedBy( Integer approvedBy ) {
		this.approvedBy = approvedBy;
		return this;
	}

	public Integer getApprovedBy() {
		return this.approvedBy;
	}

	public ProviderDto setMark( Float mark ) {
		this.mark = mark;
		return this;
	}

	public Float getMark() {
		return this.mark;
	}

	public ProviderDto setReviewCount( Integer reviewCount ) {
		this.reviewCount = reviewCount;
		return this;
	}

	public Integer getReviewCount() {
		return this.reviewCount;
	}

	public AddressDto getAddress() {
		return this.address;
	}

	public ProviderDto setAddress(AddressDto address) {
		this.address = address;
		return this;
	}
	public ProviderTypeDto getProvidertype() {
		return this.providertype;
	}

	public ProviderDto setProvidertype(ProviderTypeDto providertype) {
		this.providertype = providertype;
		return this;
	}
}