package com.tap.db.dto;

public class GroupDTO {
	private int id;
	private String name;

	public GroupDTO(int id, String name) {
		this.id = id;
		this.name = name;
	}

	public int getId() {
		return id;
	}

	public String getName() {
		return name;
	}
}
