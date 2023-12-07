/**
 * Generated JPA entity class for "ServiceEmployee"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;

@Entity
@Table(name="service_employee", catalog="tap" )
public class ServiceEmployee implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id")
	@JsonbTransient
	private Employee employee ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="service_id", referencedColumnName="id")
	@JsonbTransient
	private Service service ; 

	public ServiceEmployee() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public Employee getEmployee() {
		return this.employee;
	}
	
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	public Service getService() {
		return this.service;
	}
	
	public void setService(Service service) {
		this.service = service;
	}
}