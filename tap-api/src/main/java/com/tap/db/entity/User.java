/**
 * Generated JPA entity class for "User"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;

@Entity
@Table(name="user", catalog="tap" )
public class User implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="username", length=32)
	private String username;

    @Column(name="email", nullable=false, length=128)
	private String email;

    @Column(name="password", nullable=false, length=65535)
	private String password;

    @Column(name="salt", nullable=false, length=65535)
	private String salt;

    @Column(name="first_name", length=128)
	private String firstName;

    @Column(name="last_name", length=128)
	private String lastName;

    @Column(name="phone", length=32)
	private String phone;

    @Column(name="imgPath", length=128)
	private String imgpath;

    @Column(name="create_date", nullable=false)
	private LocalDateTime createDate;

    @Column(name="last_login")
	private LocalDateTime lastLogin;

    @Column(name="verified", nullable=false)
	private byte verified;

    @Column(name="active", nullable=false)
	private byte active;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="address_id", referencedColumnName="id")
	@JsonbTransient
	private Address address ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_state_id", referencedColumnName="id")
	@JsonbTransient
	private UserState userstate ; 

	public User() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setUsername( String username ) {
		this.username = username ;
	}

	public String getUsername() {
		return this.username;
	}

	public void setEmail( String email ) {
		this.email = email ;
	}

	public String getEmail() {
		return this.email;
	}

	public void setPassword( String password ) {
		this.password = password ;
	}

	public String getPassword() {
		return this.password;
	}

	public void setSalt( String salt ) {
		this.salt = salt ;
	}

	public String getSalt() {
		return this.salt;
	}

	public void setFirstName( String firstName ) {
		this.firstName = firstName ;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public void setLastName( String lastName ) {
		this.lastName = lastName ;
	}

	public String getLastName() {
		return this.lastName;
	}

	public void setPhone( String phone ) {
		this.phone = phone ;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setImgpath( String imgpath ) {
		this.imgpath = imgpath ;
	}

	public String getImgpath() {
		return this.imgpath;
	}

	public void setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate ;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public void setLastLogin( LocalDateTime lastLogin ) {
		this.lastLogin = lastLogin ;
	}

	public LocalDateTime getLastLogin() {
		return this.lastLogin;
	}

	public void setVerified( byte verified ) {
		this.verified = verified ;
	}

	public byte getVerified() {
		return this.verified;
	}

	public void setActive( byte active ) {
		this.active = active ;
	}

	public byte getActive() {
		return this.active;
	}

	public Address getAddress() {
		return this.address;
	}
	
	public void setAddress(Address address) {
		this.address = address;
	}
	public UserState getUserstate() {
		return this.userstate;
	}
	
	public void setUserstate(UserState userstate) {
		this.userstate = userstate;
	}
}