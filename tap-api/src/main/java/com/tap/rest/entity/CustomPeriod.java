/**
 * Generated JPA entity class for "CustomPeriod"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.time.LocalDateTime;

@Entity
@Table(name="custom_period", catalog="tap" )
public class CustomPeriod implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private long id;

    @Column(name="start", nullable=false)
	private LocalDateTime start;

    @Column(name="end", nullable=false)
	private LocalDateTime end;

    @Column(name="comment", length=65535)
	private String comment;

    @Column(name="create_date", nullable=false)
	private LocalDateTime createDate;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="period_type_id", referencedColumnName="id")
	private PeriodType periodtype; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="repeat_type_id", referencedColumnName="id")
	private RepeatType repeattype; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="created_by", referencedColumnName="id")
	private User user; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="employee_id", referencedColumnName="id")
	private Employee employee; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_id", referencedColumnName="id")
	private Provider provider; 

	public CustomPeriod() {
		super();
	}
	
	public void setId( long id ) {
		this.id = id;
	}

	public long getId() {
		return this.id;
	}

	public void setStart( LocalDateTime start ) {
		this.start = start;
	}

	public LocalDateTime getStart() {
		return this.start;
	}

	public void setEnd( LocalDateTime end ) {
		this.end = end;
	}

	public LocalDateTime getEnd() {
		return this.end;
	}

	public void setComment( String comment ) {
		this.comment = comment;
	}

	public String getComment() {
		return this.comment;
	}

	public void setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public PeriodType getPeriodtype() {
		return this.periodtype;
	}
	
	public void setPeriodtype(PeriodType periodtype) {
		this.periodtype = periodtype;
	}
	public RepeatType getRepeattype() {
		return this.repeattype;
	}
	
	public void setRepeattype(RepeatType repeattype) {
		this.repeattype = repeattype;
	}
	public User getUser() {
		return this.user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
	public Employee getEmployee() {
		return this.employee;
	}
	
	public void setEmployee(Employee employee) {
		this.employee = employee;
	}
	public Provider getProvider() {
		return this.provider;
	}
	
	public void setProvider(Provider provider) {
		this.provider = provider;
	}
}