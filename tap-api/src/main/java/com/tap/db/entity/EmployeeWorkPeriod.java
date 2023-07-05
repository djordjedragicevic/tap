/*
 * Created on 2023-07-05 ( 14:46:16 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
/**
 * JPA entity class for "EmployeeWorkPeriod"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name="employee_work_period", catalog="tap" )
public class EmployeeWorkPeriod implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="start_day")
	private Byte startDay;

    @Column(name="start_time")
	private LocalTime startTime;

    @Column(name="end_day")
	private Byte endDay;

    @Column(name="end_time")
	private LocalTime endTime;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id")
	private Employee employee ; 

	public EmployeeWorkPeriod() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
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

	public Employee getEmployee() {
		return this.employee;
	}
}