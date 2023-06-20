/*
 * Created on 2023-06-20 ( 07:13:26 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.util.List;

/**
 * JPA entity class for "Category"
 *
 * @author Telosys
 *
 */
@Entity
@Table(name="category", catalog="tap" )
public class Category implements Serializable {
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


	//--- ENTITY LINKS ( RELATIONSHIP )
    @OneToMany(mappedBy="category")
	private List<Service> serviceList ; 


	/**
	 * Constructor
	 */
	public Category() {
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

	//--- GETTERS FOR LINKS
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
  return sb.toString(); 
 } 

}