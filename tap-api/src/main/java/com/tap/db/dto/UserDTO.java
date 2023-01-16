package com.tap.db.dto;

public record UserDTO(
		long id,
		String firstName,
		String lastName,
		String username
) {
}