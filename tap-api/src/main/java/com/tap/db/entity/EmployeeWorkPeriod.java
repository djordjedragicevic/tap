/*
 * Created on 2023-06-20 ( 07:13:26 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.time.LocalTime;

/**
 * JPA entity class for "EmployeeWorkPeriod"
 *
 * @author Telosys
 *
 */
@Entity
@Table(name="employee_work_period", catalog="tap" )
public class EmployeeWorkPeriod implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

	//--- ENTITY PRIMARY KEY 
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id ;

	//--- ENTITY DATA FIELDS 
    @Column(name="employee_id", nullable=false)
	private int employeeId ;

    @Column(name="start_day")
	private Byte startDay ;

    @Column(name="start_time")
	private LocalTime startTime ;

    @Column(name="end_day")
	private Byte endDay ;

    @Column(name="end_time")
	private LocalTime endTime ;


	//--- ENTITY LINKS ( RELATIONSHIP )
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id", insertable=false, updatable=false)
	private Employee   employee ; 


	/**
	 * Constructor
	 */
	public EmployeeWorkPeriod() {
		super();
	}
	
	//--- GETTERS & SETTERS FOR FIELDS
	public void setId( int id ) {
		this.id = id ;
	}
	public int getId() {
		return this.id;
	}

	public void setEmployeeId( int employeeId ) {
		this.employeeId = employeeId ;
	}
	public int getEmployeeId() {
		return this.employeeId;
	}

	public void setStartDay( Byte startDay ) {
		this.startDay = startDay ;
	}
	public Byte getStartDay() {
		return this.startDay;
	}

	public void setStartTime( LocalTime startTime ) {
		this.startTime = startTime ;
	}
	public LocalTime getStartTime() {
		return this.startTime;
	}

	public void setEndDay( Byte endDay ) {
		this.endDay = endDay ;
	}
	public Byte getEndDay() {
		return this.endDay;
	}

	public void setEndTime( LocalTime endTime ) {
		this.endTime = endTime ;
	}
	public LocalTime getEndTime() {
		return this.endTime;
	}

	//--- GETTERS FOR LINKS
	public Employee getEmployee() {
		return this.employee;
	} 

	//--- toString specific method
	@Override
 public String toString() { 
  StringBuilder sb = new StringBuilder(); 
  sb.append(id);
  sb.append("|");
  sb.append(employeeId);
  sb.append("|");
  sb.append(startDay);
  sb.append("|");
  sb.append(startTime);
  sb.append("|");
  sb.append(endDay);
  sb.append("|");
  sb.append(endTime);
  return sb.toString(); 
 } 

}