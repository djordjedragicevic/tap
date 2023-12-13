/**
 * Generated JPA entity class for "Employee"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

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

    @Column(name="image_path", length=128)
	private String imagePath;

    @Column(name="active", nullable=false)
	private byte active;


    @OneToMany(mappedBy="employee")
	@JsonbTransient
	private List<Appointment> appointmentList; 

    @OneToMany(mappedBy="employee")
	@JsonbTransient
	private List<CustomPeriod> customperiodList; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_id", referencedColumnName="id")
	private Provider provider; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", referencedColumnName="id")
	private User user; 

    @OneToMany(mappedBy="employee")
	@JsonbTransient
	private List<ServiceEmployee> serviceemployeeList; 

    @OneToMany(mappedBy="employee")
	@JsonbTransient
	private List<WorkInfo> workinfoList; 

	public Employee() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id;
	}

	public int getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setImagePath( String imagePath ) {
		this.imagePath = imagePath;
	}

	public String getImagePath() {
		return this.imagePath;
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
	public List<CustomPeriod> getCustomperiodList() {
		return this.customperiodList;
	}
	
	public void setCustomperiodList(List<CustomPeriod> customperiodList) {
		this.customperiodList = customperiodList;
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
	public List<ServiceEmployee> getServiceemployeeList() {
		return this.serviceemployeeList;
	}
	
	public void setServiceemployeeList(List<ServiceEmployee> serviceemployeeList) {
		this.serviceemployeeList = serviceemployeeList;
	}
	public List<WorkInfo> getWorkinfoList() {
		return this.workinfoList;
	}
	
	public void setWorkinfoList(List<WorkInfo> workinfoList) {
		this.workinfoList = workinfoList;
	}
}