/**
 * Generated DTO class for "WorkInfo"
 */
package com.tap.rest.dto;
import java.time.LocalTime;
public class WorkInfoDto {	
	private Integer id;
	private Byte day;
	private LocalTime startTime;
	private LocalTime endTime;
	private EmployeeDto employee; 
	private PeriodTypeDto periodtype; 
	private ProviderDto provider; 
	public WorkInfoDto() {}

	public WorkInfoDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public WorkInfoDto setDay( byte day ) {
		this.day = day;
		return this;
	}

	public byte getDay() {
		return this.day;
	}

	public WorkInfoDto setStartTime( LocalTime startTime ) {
		this.startTime = startTime;
		return this;
	}

	public LocalTime getStartTime() {
		return this.startTime;
	}

	public WorkInfoDto setEndTime( LocalTime endTime ) {
		this.endTime = endTime;
		return this;
	}

	public LocalTime getEndTime() {
		return this.endTime;
	}

	public EmployeeDto getEmployee() {
		return this.employee;
	}

	public WorkInfoDto setEmployee(EmployeeDto employee) {
		this.employee = employee;
		return this;
	}
	public PeriodTypeDto getPeriodtype() {
		return this.periodtype;
	}

	public WorkInfoDto setPeriodtype(PeriodTypeDto periodtype) {
		this.periodtype = periodtype;
		return this;
	}
	public ProviderDto getProvider() {
		return this.provider;
	}

	public WorkInfoDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
}