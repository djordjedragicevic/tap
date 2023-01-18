package com.tap.appointments;

import com.tap.db.dto.CompanyWorkDayDTO;
import com.tap.db.dto.EmployeeWorkDayDTO;

import java.util.List;

public record AppointmentsResp(CompanyWorkDayDTO company, List<EmployeePeriod> employeePeriods) {
	public record EmployeePeriod(EmployeeWorkDayDTO employeeWorkDayDTO, List<TimePeriod> timePeriods) {
	}

}
