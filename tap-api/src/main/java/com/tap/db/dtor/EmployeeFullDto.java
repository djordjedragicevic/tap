package com.tap.db.dtor;

public record EmployeeFullDto(
		Object id, Object name, Object imagePath,
		ProviderDto providerDto,
		Object uId, Object uEmail
) {
}
