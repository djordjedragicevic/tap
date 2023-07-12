package com.tap.user;

import com.tap.common.Util;
import com.tap.db.entity.User;
import com.tap.db.entity.UserState;
import jakarta.enterprise.context.RequestScoped;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;

@RequestScoped
public class UserDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public Map<String, Object> getUserData(int userId) {
		String query = """
				SELECT u.id, u.firstName, u.lastName, u.email, s.favoriteProviders FROM User u
				LEFT JOIN UserState s ON s.user = u
				WHERE u.id = :id AND u.active = 1
				""";

		try {

			Object[] user = em.createQuery(query, Object[].class)
					.setParameter("id", userId)
					.getSingleResult();

			return Util.convertToMap(user, "id", "firstName", "lastName", "email", "favoriteProviders");


		} catch (NoResultException e) {
			return Map.of();
		}

	}

	@Transactional
	public void updateState(long userId, JsonObject state) {

		String query = "SELECT s FROM UserState s JOIN s.user u WHERE u.id = :userId";

		UserState userState;
		boolean doPersist = false;

		try {
			userState = em.createQuery(query, UserState.class)
					.setParameter("userId", userId)
					.getSingleResult();
		} catch (NoResultException e) {
			doPersist = true;
			userState = new UserState();
		}

		if (userState != null) {
			if (state.containsKey("favoriteProviders")) {
				userState.setFavoriteProviders(state.getJsonArray("favoriteProviders").toString());
			}
		}


		em.persist(userState);
	}
}
