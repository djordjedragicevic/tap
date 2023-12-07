/**
 * Generated JPA entity class for "Role"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;

@Entity
@Table(name="role", catalog="tap" )
public class Role implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private byte id;

    @Column(name="name", nullable=false, length=64)
	private String name;

    @Column(name="active", nullable=false)
	private byte active;


	public Role() {
		super();
	}
	
	public void setId( byte id ) {
		this.id = id ;
	}

	public byte getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name ;
	}

	public String getName() {
		return this.name;
	}

	public void setActive( byte active ) {
		this.active = active ;
	}

	public byte getActive() {
		return this.active;
	}

}