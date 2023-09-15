/**
 * Generated DTO class for "BusyPeriod"
 */
package com.tap.db.dto;
import java.time.LocalDateTime;
public class BusyPeriodDto {	
	private Long id;
	private LocalDateTime start;
	private LocalDateTime end;
	private String comment;
	private LocalDateTime createDate;
	private PeriodTypeDto periodtype; 
	private RepeatTypeDto repeattype; 
	private UserDto user; 
	private EmployeeDto employee; 
	private ProviderDto provider; 
	public BusyPeriodDto() {}

	public BusyPeriodDto setId( Long id ) {
		this.id = id;
		return this;
	}

	public Long getId() {
		return this.id;
	}

	public BusyPeriodDto setStart( LocalDateTime start ) {
		this.start = start;
		return this;
	}

	public LocalDateTime getStart() {
		return this.start;
	}

	public BusyPeriodDto setEnd( LocalDateTime end ) {
		this.end = end;
		return this;
	}

	public LocalDateTime getEnd() {
		return this.end;
	}

	public BusyPeriodDto setComment( String comment ) {
		this.comment = comment;
		return this;
	}

	public String getComment() {
		return this.comment;
	}

	public BusyPeriodDto setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate;
		return this;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public PeriodTypeDto getPeriodtype() {
		return this.periodtype;
	}

	public BusyPeriodDto setPeriodtype(PeriodTypeDto periodtype) {
		this.periodtype = periodtype;
		return this;
	}
	public RepeatTypeDto getRepeattype() {
		return this.repeattype;
	}

	public BusyPeriodDto setRepeattype(RepeatTypeDto repeattype) {
		this.repeattype = repeattype;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public BusyPeriodDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
	public EmployeeDto getEmployee() {
		return this.employee;
	}

	public BusyPeriodDto setEmployee(EmployeeDto employee) {
		this.employee = employee;
		return this;
	}
	public ProviderDto getProvider() {
		return this.provider;
	}

	public BusyPeriodDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
}