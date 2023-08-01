/*
 * Created on 2023-08-01 ( 15:55:49 )
 * Generated by Telosys ( http://www.telosys.org/ ) version 4.0.0
 */
/**
 * JPA entity class for "ProviderWorkPeriod"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name="provider_work_period", catalog="tap" )
public class ProviderWorkPeriod implements Serializable {
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
    @JoinColumn(name="provider_id", referencedColumnName="id")
	private Provider provider ; 

	public ProviderWorkPeriod() {
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

	public Provider getProvider() {
		return this.provider;
	}
	
	public void setProvider(Provider provider) {
		this.provider = provider;
	}
}