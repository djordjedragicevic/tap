package com.tap.db.dto;

public record UserDTO(
		long getId,
		String getFirstName,
		String getLastName,
		String getUsername
) {
}