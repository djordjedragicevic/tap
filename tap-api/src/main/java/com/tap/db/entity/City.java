/**
 * Generated JPA entity class for "City"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;

@Entity
@Table(name="city", catalog="tap" )
public class City implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private short id;

    @Column(name="name", nullable=false, length=64)
	private String name;

    @Column(name="post_code", nullable=false, length=16)
	private String postCode;

    @Column(name="active", nullable=false)
	private boolean active;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="country_id", referencedColumnName="id")
	@JsonbTransient
	private Country country ; 

	public City() {
		super();
	}
	
	public void setId( short id ) {
		this.id = id ;
	}

	public short getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name ;
	}

	public String getName() {
		return this.name;
	}

	public void setPostCode( String postCode ) {
		this.postCode = postCode ;
	}

	public String getPostCode() {
		return this.postCode;
	}

	public void setActive( boolean active ) {
		this.active = active ;
	}

	public boolean isActive() {
		return this.active;
	}

	public Country getCountry() {
		return this.country;
	}
	
	public void setCountry(Country country) {
		this.country = country;
	}
}