package com.tap.db.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyDTO {
	private String name;
	private String type;
	private String address;
	private String country;
	private String city;
}
