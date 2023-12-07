/**
 * Generated JPA entity class for "WorkPeriod"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalTime;

@Entity
@Table(name="work_period", catalog="tap" )
public class WorkPeriod implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="day", nullable=false)
	private byte day;

    @Column(name="start_time", nullable=false)
	private LocalTime startTime;

    @Column(name="end_time", nullable=false)
	private LocalTime endTime;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id")
	@JsonbTransient
	private Employee employee ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="period_type_id", referencedColumnName="id")
	@JsonbTransient
	private PeriodType periodtype ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_id", referencedColumnName="id")
	@JsonbTransient
	private Provider provider ; 

	public WorkPeriod() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setDay( byte day ) {
		this.day = day ;
	}

	public byte getDay() {
		return this.day;
	}

	public void setStartTime( LocalTime startTime ) {
		this.startTime = startTime ;
	}

	public LocalTime getStartTime() {
		return this.startTime;
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
	
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	public PeriodType getPeriodtype() {
		return this.periodtype;
	}
	
	public void setPeriodtype(PeriodType periodtype) {
		this.periodtype = periodtype;
	}
	public Provider getProvider() {
		return this.provider;
	}
	
	public void setProvider(Provider provider) {
		this.provider = provider;
	}
}