package com.tap.user;

import com.tap.db.entity.User;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.Map;

@RequestScoped
public class UserDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public Map<String, Object> getUserData(int userId) {
		User user = em.find(User.class, userId);
		if (user != null && user.getActive() == 1) {
			return Map.of(
					"id", user.getId(),
					"firstName", user.getFirstName(),
					"lastName", user.getLastName(),
					"email", user.getEmail()
			);
		} else {
			return Map.of();
		}
	}
}
