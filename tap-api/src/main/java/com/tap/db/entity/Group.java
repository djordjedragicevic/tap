/*
 * Created on 2023-07-03 ( 13:32:28 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
/**
 * JPA entity class for "Group"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

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


	public Group() {
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

}