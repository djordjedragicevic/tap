package com.tap.db.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserDTO {
	private Long id;
	private String firstName;
	private String lastName;
	private String username;
}