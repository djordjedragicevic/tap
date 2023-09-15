/**
 * Generated JPA entity class for "PeriodType"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="period_type", catalog="tap" )
public class PeriodType implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", nullable=false, length=32)
	private String name;

    @Column(name="active", nullable=false)
	private boolean active;

    @Column(name="open", nullable=false)
	private byte open;

    @Column(name="description", length=512)
	private String description;


	public PeriodType() {
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

	public void setActive( boolean active ) {
		this.active = active ;
	}

	public boolean isActive() {
		return this.active;
	}

	public void setOpen( byte open ) {
		this.open = open ;
	}

	public byte getOpen() {
		return this.open;
	}

	public void setDescription( String description ) {
		this.description = description ;
	}

	public String getDescription() {
		return this.description;
	}

}