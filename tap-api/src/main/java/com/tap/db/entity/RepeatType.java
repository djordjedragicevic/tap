/**
 * Generated JPA entity class for "RepeatType"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;

@Entity
@Table(name="repeat_type", catalog="tap" )
public class RepeatType implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private byte id;

    @Column(name="name", nullable=false, length=45)
	private String name;

    @Column(name="active", nullable=false)
	private boolean active;


	public RepeatType() {
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

	public void setActive( boolean active ) {
		this.active = active ;
	}

	public boolean isActive() {
		return this.active;
	}

}