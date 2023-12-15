/**
 * Generated DTO class for "CustomPeriod"
 */
package com.tap.rest.dto;
import java.time.LocalDateTime;
public class CustomPeriodDto {	
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
	public CustomPeriodDto() {}

	public CustomPeriodDto setId( Long id ) {
		this.id = id;
		return this;
	}

	public Long getId() {
		return this.id;
	}

	public CustomPeriodDto setStart( LocalDateTime start ) {
		this.start = start;
		return this;
	}

	public LocalDateTime getStart() {
		return this.start;
	}

	public CustomPeriodDto setEnd( LocalDateTime end ) {
		this.end = end;
		return this;
	}

	public LocalDateTime getEnd() {
		return this.end;
	}

	public CustomPeriodDto setComment( String comment ) {
		this.comment = comment;
		return this;
	}

	public String getComment() {
		return this.comment;
	}

	public CustomPeriodDto setCreateDate( LocalDateTime createDate ) {
		this.createDate = createDate;
		return this;
	}

	public LocalDateTime getCreateDate() {
		return this.createDate;
	}

	public PeriodTypeDto getPeriodtype() {
		return this.periodtype;
	}

	public CustomPeriodDto setPeriodtype(PeriodTypeDto periodtype) {
		this.periodtype = periodtype;
		return this;
	}
	public RepeatTypeDto getRepeattype() {
		return this.repeattype;
	}

	public CustomPeriodDto setRepeattype(RepeatTypeDto repeattype) {
		this.repeattype = repeattype;
		return this;
	}
	public UserDto getUser() {
		return this.user;
	}

	public CustomPeriodDto setUser(UserDto user) {
		this.user = user;
		return this;
	}
	public EmployeeDto getEmployee() {
		return this.employee;
	}

	public CustomPeriodDto setEmployee(EmployeeDto employee) {
		this.employee = employee;
		return this;
	}
	public ProviderDto getProvider() {
		return this.provider;
	}

	public CustomPeriodDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
}