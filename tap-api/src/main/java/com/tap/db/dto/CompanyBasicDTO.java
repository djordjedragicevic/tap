package com.tap.db.dto;

public record CompanyBasicDTO(long id,
							  String name,
							  String typeName,
							  String addressStreet,
							  String addressNumber,
							  float addressLongitude,
							  float addressLatitude) {

}