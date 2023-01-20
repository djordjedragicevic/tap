package com.tap.appointments;

import com.tap.db.dto.CompanyWorkDayDTO;
import com.tap.db.dto.EmployeeWorkDayDTO;

import java.util.List;

public record AppointmentsResp(CompanyWorkDayDTO getCompany, List<EmployeePeriod> getEmployeePeriods) {
	public record EmployeePeriod(EmployeeWorkDayDTO getEmployeeWorkDayDTO, List<TimePeriod> getTimePeriods) {
	}

}
