package com.tap.db.dao;

import com.tap.common.Util;
import com.tap.db.entity.Role;
import com.tap.db.entity.User;
import com.tap.db.entity.UserState;
import jakarta.enterprise.context.RequestScoped;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequestScoped
public class UserDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public Map<String, Object> getUserData(int userId) {

		Map<String, Object> resp = new LinkedHashMap<>();

		User u = em.find(User.class, userId);
		if (u != null && u.getActive() == 1) {
			resp.put("id", u.getId());
			resp.put("username", u.getUsername());
			resp.put("firstName", u.getFirstName());
			resp.put("lastName", u.getLastName());
			resp.put("email", u.getEmail());
			resp.put("state", u.getUserstate());

			resp.put("roles", getRoles(userId).stream().map(Role::getName).toList());
		}

		return resp;
	}

	public Optional<User> getUserByCredentials(String username, String password) {

		boolean byMail = Util.isMail(username);

		String query = "SELECT u FROM User u WHERE u.active = 1 AND u.password = :pass "
					   + (byMail ? "AND u.email = :username" : "AND u.username = :username");

		try {

			User u = em.createQuery(query, User.class)
					.setParameter("pass", password)
					.setParameter("username", username)
					.getSingleResult();

			return Optional.of(u);

		} catch (Exception e) {
			return Optional.empty();
		}

	}

	public List<Role> getRoles(int userId) {

		return em.createQuery("SELECT r FROM Role r INNER JOIN UserRole uR ON r = uR.role WHERE uR.user.id = :uId", Role.class)
				.setParameter("uId", userId)
				.getResultList();
	}


	@Transactional
	public void updateState(int userId, JsonObject state) {

		User u = em.find(User.class, userId);
		if (u != null && u.getActive() == 1) {
			UserState userState = u.getUserstate();

			if (userState == null) {
				userState = new UserState();
				em.persist(userState);
				u.setUserstate(userState);
			}

			if (state.containsKey("favoriteProviders"))
				userState.setFavoriteProviders(state.getJsonArray("favoriteProviders").toString());
		}
	}
}
