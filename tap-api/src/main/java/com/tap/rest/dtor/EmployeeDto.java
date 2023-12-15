package com.tap.rest.dtor;

public record EmployeeDto(Object id, Object name, String imagePath) {
	@Override
	public boolean equals(Object obj) {
		return obj instanceof EmployeeDto e && this.id.equals(e.id());
	}
}
