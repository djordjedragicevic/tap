package com.tap.db.entity_old;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "users_roles")
public class UsersRole implements Serializable {
	@Serial
	private static final long serialVersionUID = 5055500657406567775L;
	private Long id;

	private Role role;

	private User user;

	@Id
	@Column(name = "id", columnDefinition = "INT UNSIGNED not null")
	public Long getId() {
		return id;
	}

	public UsersRole setId(Long id) {
		this.id = id;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "role_id", nullable = false)
	public Role getRole() {
		return role;
	}

	public UsersRole setRole(Role role) {
		this.role = role;
		return this;
	}

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	public User getUser() {
		return user;
	}

	public UsersRole setUser(User user) {
		this.user = user;
		return this;
	}

}