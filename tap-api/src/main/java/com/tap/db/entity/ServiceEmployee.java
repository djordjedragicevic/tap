/*
 * Created on 2023-06-20 ( 07:13:26 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

/**
 * JPA entity class for "ServiceEmployee"
 *
 * @author Telosys
 *
 */
@Entity
@Table(name="service_employee", catalog="tap" )
public class ServiceEmployee implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

	//--- ENTITY PRIMARY KEY 
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id ;

	//--- ENTITY DATA FIELDS 
    @Column(name="service_id", nullable=false)
	private int serviceId ;

    @Column(name="employee_id", nullable=false)
	private int employeeId ;


	//--- ENTITY LINKS ( RELATIONSHIP )
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id", insertable=false, updatable=false)
	private Employee   employee ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="service_id", referencedColumnName="id", insertable=false, updatable=false)
	private Service    service ; 


	/**
	 * Constructor
	 */
	public ServiceEmployee() {
		super();
	}
	
	//--- GETTERS & SETTERS FOR FIELDS
	public void setId( int id ) {
		this.id = id ;
	}
	public int getId() {
		return this.id;
	}

	public void setServiceId( int serviceId ) {
		this.serviceId = serviceId ;
	}
	public int getServiceId() {
		return this.serviceId;
	}

	public void setEmployeeId( int employeeId ) {
		this.employeeId = employeeId ;
	}
	public int getEmployeeId() {
		return this.employeeId;
	}

	//--- GETTERS FOR LINKS
	public Employee getEmployee() {
		return this.employee;
	} 

	public Service getService() {
		return this.service;
	} 

	//--- toString specific method
	@Override
 public String toString() { 
  StringBuilder sb = new StringBuilder(); 
  sb.append(id);
  sb.append("|");
  sb.append(serviceId);
  sb.append("|");
  sb.append(employeeId);
  return sb.toString(); 
 } 

}