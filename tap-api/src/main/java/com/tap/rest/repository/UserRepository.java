package com.tap.rest.repository;

import com.tap.common.Util;
import com.tap.rest.dto.UserDto;
import com.tap.rest.entity.*;
import com.tap.security.Security;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.JsonObject;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@ApplicationScoped
public class UserRepository extends CommonRepository {

	public Map<String, Object> getUserData(int userId) {

		Map<String, Object> resp = new LinkedHashMap<>();

		User u = em.find(User.class, userId);


		if (u != null && u.getActive() == 1) {
			resp.put("id", u.getId());
			resp.put("username", u.getUsername());
			resp.put("email", u.getEmail());
			resp.put("phone", u.getPhone());
			resp.put("imgPath", u.getImgpath());
			resp.put("firstName", u.getFirstName());
			resp.put("lastName", u.getLastName());
			resp.put("state", u.getUserstate());
			resp.put("roles", getRoles(userId).stream().map(Role::getName).toList());
		}

		return resp;
	}

	public void setUserData(int userId, UserDto userData) {
		User u = em.find(User.class, userId);
		if (u != null && u.getActive() == 1) {

			u.setUsername(userData.getUsername());
			u.setEmail(userData.getEmail());
			u.setFirstName(userData.getFirstName());
			u.setLastName(userData.getLastName());
			u.setPhone(userData.getPhone());
			u.setImgpath(userData.getImgpath());

			em.persist(u);
		}
	}

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

	public Optional<User> getUserByCredentials(String username, String password) {

		boolean byMail = Util.isMail(username);

		String query = "SELECT u FROM User u WHERE " + (byMail ? " u.email = :username" : " u.username = :username");

		try {
			User u = em.createQuery(query, User.class)
					.setParameter("username", username)
					.getSingleResult();

			if (u != null) {
				String pass = u.getPassword();
				String salt = u.getSalt();
				String encryptedPass = Security.encryptPassword(password, salt);

				if (encryptedPass.equals(pass))
					return Optional.of(u);
			}

			return Optional.empty();

		} catch (Exception e) {
			return Optional.empty();
		}

	}

	public List<Role> getRoles(int userId) {

		return em.createQuery("SELECT r FROM Role r INNER JOIN UserRole uR ON r = uR.role WHERE uR.user.id = :uId", Role.class)
				.setParameter("uId", userId)
				.getResultList();
	}

	public List<Integer> getFavoriteProviderIds(int userId) {
		return em.createQuery("SELECT f.provider.id FROM FavoriteProvider f WHERE f.user.id = :uId", Integer.class)
				.setParameter("uId", userId)
				.getResultList();
	}

	public List<String> getRoleNames(int userId) {

		return em.createQuery("SELECT r.name FROM Role r INNER JOIN UserRole uR ON r = uR.role WHERE uR.user.id = :uId", String.class)
				.setParameter("uId", userId)
				.getResultList();
	}
}
