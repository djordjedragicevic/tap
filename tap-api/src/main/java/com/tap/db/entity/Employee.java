/**
 * Generated JPA entity class for "Employee"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="employee", catalog="tap" )
public class Employee implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", nullable=false, length=32)
	private String name;

    @Column(name="image_path", length=64)
	private String imagePath;

    @Column(name="active", nullable=false)
	private byte active;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_id", referencedColumnName="id")
	private Provider provider ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", referencedColumnName="id")
	private User user ; 

	public Employee() {
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

	public void setImagePath( String imagePath ) {
		this.imagePath = imagePath ;
	}

	public String getImagePath() {
		return this.imagePath;
	}

	public void setActive( byte active ) {
		this.active = active ;
	}

	public byte getActive() {
		return this.active;
	}

	public Provider getProvider() {
		return this.provider;
	}
	
	public void setProvider(Provider provider) {
		this.provider = provider;
	}
	public User getUser() {
		return this.user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
}