/**
 * Generated JPA entity class for "User"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;
import java.util.List;

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


    @OneToMany()
	@JsonbTransient
	private List<Appointment> appointmentList; 

    @OneToMany()
	@JsonbTransient
	private List<Appointment> appointmentList2; 

    @OneToMany(mappedBy="user")
	@JsonbTransient
	private List<CustomPeriod> customperiodList; 

    @OneToMany(mappedBy="user")
	@JsonbTransient
	private List<Employee> employeeList; 

    @OneToMany(mappedBy="user")
	@JsonbTransient
	private List<FavoriteProvider> favoriteproviderList; 

    @OneToMany()
	@JsonbTransient
	private List<Review> reviewList; 

    @OneToMany()
	@JsonbTransient
	private List<Review> reviewList2; 

    @OneToMany(mappedBy="user")
	@JsonbTransient
	private List<Token> tokenList; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="address_id", referencedColumnName="id")
	private Address address; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_state_id", referencedColumnName="id")
	private UserState userstate; 

    @OneToMany(mappedBy="user")
	@JsonbTransient
	private List<UserRole> userroleList; 

    @OneToMany(mappedBy="user")
	@JsonbTransient
	private List<UserVerification> userverificationList; 

	public User() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id;
	}

	public int getId() {
		return this.id;
	}

	public void setUsername( String username ) {
		this.username = username;
	}

	public String getUsername() {
		return this.username;
	}

	public void setEmail( String email ) {
		this.email = email;
	}

	public String getEmail() {
		return this.email;
	}

	public void setPassword( String password ) {
		this.password = password;
	}

	public String getPassword() {
		return this.password;
	}

	public void setSalt( String salt ) {
		this.salt = salt;
	}

	public String getSalt() {
		return this.salt;
	}

	public void setFirstName( String firstName ) {
		this.firstName = firstName;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public void setLastName( String lastName ) {
		this.lastName = lastName;
	}

	public String getLastName() {
		return this.lastName;
	}

	public void setPhone( String phone ) {
		this.phone = phone;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setImgpath( String imgpath ) {
		this.imgpath = imgpath;
	}

	public String getImgpath() {
		return this.imgpath;
	}

	public void setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public void setLastLogin( LocalDateTime lastLogin ) {
		this.lastLogin = lastLogin;
	}

	public LocalDateTime getLastLogin() {
		return this.lastLogin;
	}

	public void setVerified( byte verified ) {
		this.verified = verified;
	}

	public byte getVerified() {
		return this.verified;
	}

	public void setActive( byte active ) {
		this.active = active;
	}

	public byte getActive() {
		return this.active;
	}

	public List<Appointment> getAppointmentList() {
		return this.appointmentList;
	}
	
	public void setAppointmentList(List<Appointment> appointmentList) {
		this.appointmentList = appointmentList;
	}
	public List<Appointment> getAppointmentList2() {
		return this.appointmentList2;
	}
	
	public void setAppointmentList2(List<Appointment> appointmentList2) {
		this.appointmentList2 = appointmentList2;
	}
	public List<CustomPeriod> getCustomperiodList() {
		return this.customperiodList;
	}
	
	public void setCustomperiodList(List<CustomPeriod> customperiodList) {
		this.customperiodList = customperiodList;
	}
	public List<Employee> getEmployeeList() {
		return this.employeeList;
	}
	
	public void setEmployeeList(List<Employee> employeeList) {
		this.employeeList = employeeList;
	}
	public List<FavoriteProvider> getFavoriteproviderList() {
		return this.favoriteproviderList;
	}
	
	public void setFavoriteproviderList(List<FavoriteProvider> favoriteproviderList) {
		this.favoriteproviderList = favoriteproviderList;
	}
	public List<Review> getReviewList() {
		return this.reviewList;
	}
	
	public void setReviewList(List<Review> reviewList) {
		this.reviewList = reviewList;
	}
	public List<Review> getReviewList2() {
		return this.reviewList2;
	}
	
	public void setReviewList2(List<Review> reviewList2) {
		this.reviewList2 = reviewList2;
	}
	public List<Token> getTokenList() {
		return this.tokenList;
	}
	
	public void setTokenList(List<Token> tokenList) {
		this.tokenList = tokenList;
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
	public List<UserRole> getUserroleList() {
		return this.userroleList;
	}
	
	public void setUserroleList(List<UserRole> userroleList) {
		this.userroleList = userroleList;
	}
	public List<UserVerification> getUserverificationList() {
		return this.userverificationList;
	}
	
	public void setUserverificationList(List<UserVerification> userverificationList) {
		this.userverificationList = userverificationList;
	}
}