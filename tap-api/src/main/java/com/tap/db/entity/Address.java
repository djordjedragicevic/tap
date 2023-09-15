/**
 * Generated JPA entity class for "Address"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="address", catalog="tap" )
public class Address implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="street", nullable=false, length=128)
	private String street;

    @Column(name="number", nullable=false, length=8)
	private String number;

    @Column(name="longitude")
	private Float longitude;

    @Column(name="latitude")
	private Float latitude;

    @Column(name="phone", length=32)
	private String phone;

    @Column(name="flat_number", length=8)
	private String flatNumber;

    @Column(name="address1", length=136)
	private String address1;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="city_id", referencedColumnName="id")
	private City city ; 

	public Address() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setStreet( String street ) {
		this.street = street ;
	}

	public String getStreet() {
		return this.street;
	}

	public void setNumber( String number ) {
		this.number = number ;
	}

	public String getNumber() {
		return this.number;
	}

	public void setLongitude( Float longitude ) {
		this.longitude = longitude ;
	}

	public Float getLongitude() {
		return this.longitude;
	}

	public void setLatitude( Float latitude ) {
		this.latitude = latitude ;
	}

	public Float getLatitude() {
		return this.latitude;
	}

	public void setPhone( String phone ) {
		this.phone = phone ;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setFlatNumber( String flatNumber ) {
		this.flatNumber = flatNumber ;
	}

	public String getFlatNumber() {
		return this.flatNumber;
	}

	public void setAddress1( String address1 ) {
		this.address1 = address1 ;
	}

	public String getAddress1() {
		return this.address1;
	}

	public City getCity() {
		return this.city;
	}
	
	public void setCity(City city) {
		this.city = city;
	}
}