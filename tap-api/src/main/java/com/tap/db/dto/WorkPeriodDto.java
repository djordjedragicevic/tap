/**
 * Generated DTO class for "WorkPeriod"
 */
package com.tap.db.dto;
import java.time.LocalTime;
public class WorkPeriodDto {	
	private Integer id;
	private Byte startDay;
	private LocalTime startTime;
	private Byte endDay;
	private LocalTime endTime;
	private EmployeeDto employee; 
	private PeriodTypeDto periodtype; 
	private ProviderDto provider; 
	public WorkPeriodDto() {}

	public WorkPeriodDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public WorkPeriodDto setStartDay( byte startDay ) {
		this.startDay = startDay;
		return this;
	}

	public byte getStartDay() {
		return this.startDay;
	}

	public WorkPeriodDto setStartTime( LocalTime startTime ) {
		this.startTime = startTime;
		return this;
	}

	public LocalTime getStartTime() {
		return this.startTime;
	}

	public WorkPeriodDto setEndDay( byte endDay ) {
		this.endDay = endDay;
		return this;
	}

	public byte getEndDay() {
		return this.endDay;
	}

	public WorkPeriodDto setEndTime( LocalTime endTime ) {
		this.endTime = endTime;
		return this;
	}

	public LocalTime getEndTime() {
		return this.endTime;
	}

	public EmployeeDto getEmployee() {
		return this.employee;
	}

	public WorkPeriodDto setEmployee(EmployeeDto employee) {
		this.employee = employee;
		return this;
	}
	public PeriodTypeDto getPeriodtype() {
		return this.periodtype;
	}

	public WorkPeriodDto setPeriodtype(PeriodTypeDto periodtype) {
		this.periodtype = periodtype;
		return this;
	}
	public ProviderDto getProvider() {
		return this.provider;
	}

	public WorkPeriodDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
}