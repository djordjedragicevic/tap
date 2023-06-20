/*
 * Created on 2023-06-20 ( 07:13:26 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * JPA entity class for "Provider"
 *
 * @author Telosys
 *
 */
@Entity
@Table(name="provider", catalog="tap" )
public class Provider implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

	//--- ENTITY PRIMARY KEY 
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id ;

	//--- ENTITY DATA FIELDS 
    @Column(name="name", nullable=false, length=64)
	private String name ;

    @Column(name="description", length=512)
	private String description ;

    @Column(name="provider_type_id", nullable=false)
	private short providerTypeId ;

    @Column(name="address_id", nullable=false)
	private int addressId ;

    @Column(name="id_number", nullable=false, length=32)
	private String idNumber ;

    @Column(name="legal_entity", nullable=false)
	private byte legalEntity ;

    @Column(name="approved", nullable=false)
	private byte approved ;

    @Column(name="approved_date")
	private LocalDateTime approvedDate ;

    @Column(name="approved_by")
	private Integer approvedBy ;

    @Column(name="active", nullable=false)
	private byte active ;


	//--- ENTITY LINKS ( RELATIONSHIP )
    @OneToMany(mappedBy="provider")
	private List<Employee> employeeList ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="address_id", referencedColumnName="id", insertable=false, updatable=false)
	private Address    address ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_type_id", referencedColumnName="id", insertable=false, updatable=false)
	private ProviderType providertype ; 

    @OneToMany(mappedBy="provider")
	private List<ProviderWorkPeriod> providerworkperiodList ; 

    @OneToMany(mappedBy="provider")
	private List<Service> serviceList ; 


	/**
	 * Constructor
	 */
	public Provider() {
		super();
	}
	
	//--- GETTERS & SETTERS FOR FIELDS
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

	public void setProviderTypeId( short providerTypeId ) {
		this.providerTypeId = providerTypeId ;
	}
	public short getProviderTypeId() {
		return this.providerTypeId;
	}

	public void setAddressId( int addressId ) {
		this.addressId = addressId ;
	}
	public int getAddressId() {
		return this.addressId;
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

	public void setActive( byte active ) {
		this.active = active ;
	}
	public byte getActive() {
		return this.active;
	}

	//--- GETTERS FOR LINKS
	public List<Employee> getEmployeeList() {
		return this.employeeList;
	} 

	public Address getAddress() {
		return this.address;
	} 

	public ProviderType getProvidertype() {
		return this.providertype;
	} 

	public List<ProviderWorkPeriod> getProviderworkperiodList() {
		return this.providerworkperiodList;
	} 

	public List<Service> getServiceList() {
		return this.serviceList;
	} 

	//--- toString specific method
	@Override
 public String toString() { 
  StringBuilder sb = new StringBuilder(); 
  sb.append(id);
  sb.append("|");
  sb.append(name);
  sb.append("|");
  sb.append(description);
  sb.append("|");
  sb.append(providerTypeId);
  sb.append("|");
  sb.append(addressId);
  sb.append("|");
  sb.append(idNumber);
  sb.append("|");
  sb.append(legalEntity);
  sb.append("|");
  sb.append(approved);
  sb.append("|");
  sb.append(approvedDate);
  sb.append("|");
  sb.append(approvedBy);
  sb.append("|");
  sb.append(active);
  return sb.toString(); 
 } 

}