package com.tap.user;

import com.tap.common.Util;
import com.tap.db.entity.User;
import com.tap.db.entity.UserState;
import jakarta.enterprise.context.RequestScoped;
import jakarta.json.JsonObject;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.util.LinkedHashMap;
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
			resp.put("firstName", u.getFirstName());
			resp.put("lastName", u.getLastName());
			resp.put("email", u.getEmail());
			resp.put("state", u.getUserstate());
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
