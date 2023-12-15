package com.tap.rest.dtor;

import java.util.Set;

public record ServiceWithEmployeesDto(Object id, Object name,
									  Object gName,
									  Set<EmployeeDto> employees) {
}
