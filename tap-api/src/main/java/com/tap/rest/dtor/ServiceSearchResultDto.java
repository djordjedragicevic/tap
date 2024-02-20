package com.tap.rest.dtor;

import java.util.ArrayList;
import java.util.List;

public class ServiceSearchResultDto {
	private Integer count = 0;
	private List<ServiceForSearchDto> services = new ArrayList<>();


	public Integer getCount() {
		return count;
	}

	public ServiceSearchResultDto setCount(Integer count) {
		this.count = count;
		return this;
	}

	public List<ServiceForSearchDto> getServices() {
		return services;
	}

	public ServiceSearchResultDto setServices(List<ServiceForSearchDto> services) {
		this.services = services;
		return this;
	}
}
