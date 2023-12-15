/**
 * Generated JPA entity class for "Category"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

@Entity
@Table(name="category", catalog="tap" )
public class Category implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", nullable=false, length=64)
	private String name;


    @OneToMany(mappedBy="category")
	@JsonbTransient
	private List<Service> serviceList; 

	public Category() {
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