/**
 * Generated JPA entity class for "Group"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;

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