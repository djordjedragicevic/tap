package com.tap.common;

public class Filter {

	private String name;
	private Object value;
	private String sqlSelector;

	public Filter(String name, Object value, String sqlSelector) {
		this.name = name;
		this.value = value;
		this.sqlSelector = sqlSelector;
	}

	public String getName() {
		return name;
	}

	public Filter setName(String name) {
		this.name = name;
		return this;
	}

	public Object getValue() {
		return value;
	}

	public Filter setValue(Object value) {
		this.value = value;
		return this;
	}

	public String getSqlSelector() {
		return sqlSelector;
	}

	public Filter setSqlSelector(String sqlSelector) {
		this.sqlSelector = sqlSelector;
		return this;
	}
}
