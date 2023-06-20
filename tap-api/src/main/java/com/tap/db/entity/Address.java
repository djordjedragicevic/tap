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
 * JPA entity class for "Address"
 *
 * @author Telosys
 *
 */
@Entity
@Table(name="address", catalog="tap" )
public class Address implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

	//--- ENTITY PRIMARY KEY 
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id ;

	//--- ENTITY DATA FIELDS 
    @Column(name="street", nullable=false, length=128)
	private String street ;

    @Column(name="number", nullable=false, length=8)
	private String number ;

    @Column(name="longitude")
	private Float longitude ;

    @Column(name="latitude")
	private Float latitude ;

    @Column(name="phone", length=32)
	private String phone ;

    @Column(name="flat_number", length=8)
	private String flatNumber ;

    @Column(name="address1", length=136)
	private String address1 ;

    @Column(name="city_id", nullable=false)
	private short cityId ;


	//--- ENTITY LINKS ( RELATIONSHIP )
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="city_id", referencedColumnName="id", insertable=false, updatable=false)
	private City       city ; 

    @OneToMany(mappedBy="address")
	private List<Provider> providerList ; 

    @OneToMany(mappedBy="address")
	private List<User> userList ; 


	/**
	 * Constructor
	 */
	public Address() {
		super();
	}
	
	//--- GETTERS & SETTERS FOR FIELDS
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

	public void setCityId( short cityId ) {
		this.cityId = cityId ;
	}
	public short getCityId() {
		return this.cityId;
	}

	//--- GETTERS FOR LINKS
	public City getCity() {
		return this.city;
	} 

	public List<Provider> getProviderList() {
		return this.providerList;
	} 

	public List<User> getUserList() {
		return this.userList;
	} 

	//--- toString specific method
	@Override
 public String toString() { 
  StringBuilder sb = new StringBuilder(); 
  sb.append(id);
  sb.append("|");
  sb.append(street);
  sb.append("|");
  sb.append(number);
  sb.append("|");
  sb.append(longitude);
  sb.append("|");
  sb.append(latitude);
  sb.append("|");
  sb.append(phone);
  sb.append("|");
  sb.append(flatNumber);
  sb.append("|");
  sb.append(address1);
  sb.append("|");
  sb.append(cityId);
  return sb.toString(); 
 } 

}