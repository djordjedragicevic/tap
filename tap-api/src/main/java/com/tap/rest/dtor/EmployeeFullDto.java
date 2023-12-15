package com.tap.rest.dtor;

public record EmployeeFullDto(
		Object id, Object name, Object imagePath,
		ProviderDto providerDto,
		Object uId, Object uEmail
) {
}
