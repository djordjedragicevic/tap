/**
 * Generated JPA entity class for "Group"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

@Entity
@Table(name="group", catalog="tap" )
public class Group implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", nullable=false, length=64)
	private String name;


    @OneToMany(mappedBy="group")
	@JsonbTransient
	private List<Service> serviceList; 

	public Group() {
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

	public List<Service> getServiceList() {
		return this.serviceList;
	}
	
	public void setServiceList(List<Service> serviceList) {
		this.serviceList = serviceList;
	}
}