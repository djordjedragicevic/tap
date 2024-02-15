/**
 * Generated JPA entity class for "Provider"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;
import java.util.List;

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

    @Column(name="phone", length=32)
	private String phone;

    @Column(name="image_path", length=128)
	private String imagePath;

    @Column(name="id_number", length=32)
	private String idNumber;

    @Column(name="legal_entity", nullable=false)
	private byte legalEntity;

    @Column(name="approved_at")
	private LocalDateTime approvedAt;

    @Column(name="approved_by")
	private Integer approvedBy;

    @Column(name="active", nullable=false)
	private byte active;


    @OneToMany(mappedBy="provider")
	@JsonbTransient
	private List<CustomPeriod> customperiodList; 

    @OneToMany(mappedBy="provider")
	@JsonbTransient
	private List<Employee> employeeList; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="address_id", referencedColumnName="id")
	private Address address; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_type_id", referencedColumnName="id")
	private ProviderType providertype; 

    @OneToMany(mappedBy="provider")
	@JsonbTransient
	private List<Review> reviewList; 

    @OneToMany(mappedBy="provider")
	@JsonbTransient
	private List<Service> serviceList; 

    @OneToMany(mappedBy="provider")
	@JsonbTransient
	private List<WorkInfo> workinfoList; 

	public Provider() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id;
	}

	public int getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setDescription( String description ) {
		this.description = description;
	}

	public String getDescription() {
		return this.description;
	}

	public void setPhone( String phone ) {
		this.phone = phone;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setImagePath( String imagePath ) {
		this.imagePath = imagePath;
	}

	public String getImagePath() {
		return this.imagePath;
	}

	public void setIdNumber( String idNumber ) {
		this.idNumber = idNumber;
	}

	public String getIdNumber() {
		return this.idNumber;
	}

	public void setLegalEntity( byte legalEntity ) {
		this.legalEntity = legalEntity;
	}

	public byte getLegalEntity() {
		return this.legalEntity;
	}

	public void setApprovedAt( LocalDateTime approvedAt ) {
		this.approvedAt = approvedAt;
	}

	public LocalDateTime getApprovedAt() {
		return this.approvedAt;
	}

	public void setApprovedBy( Integer approvedBy ) {
		this.approvedBy = approvedBy;
	}

	public Integer getApprovedBy() {
		return this.approvedBy;
	}

	public void setActive( byte active ) {
		this.active = active;
	}

	public byte getActive() {
		return this.active;
	}

	public List<CustomPeriod> getCustomperiodList() {
		return this.customperiodList;
	}
	
	public void setCustomperiodList(List<CustomPeriod> customperiodList) {
		this.customperiodList = customperiodList;
	}
	public List<Employee> getEmployeeList() {
		return this.employeeList;
	}
	
	public void setEmployeeList(List<Employee> employeeList) {
		this.employeeList = employeeList;
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
	public List<Review> getReviewList() {
		return this.reviewList;
	}
	
	public void setReviewList(List<Review> reviewList) {
		this.reviewList = reviewList;
	}
	public List<Service> getServiceList() {
		return this.serviceList;
	}
	
	public void setServiceList(List<Service> serviceList) {
		this.serviceList = serviceList;
	}
	public List<WorkInfo> getWorkinfoList() {
		return this.workinfoList;
	}
	
	public void setWorkinfoList(List<WorkInfo> workinfoList) {
		this.workinfoList = workinfoList;
	}
}