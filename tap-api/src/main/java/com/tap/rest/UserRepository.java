package com.tap.rest;

import com.tap.common.Util;
import com.tap.db.entity.Role;
import com.tap.db.entity.User;
import com.tap.db.entity.UserState;
import com.tap.db.entity.UserVerification;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.security.Security;
import jakarta.enterprise.context.RequestScoped;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequestScoped
public class UserRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	@Transactional
	public void saveNewUser(User u, String code) {

		em.persist(u);

		long vCDuration = ConfigProvider.getConfig().getValue("tap.verification.code.duration", Long.class);
		LocalDateTime vCTime = LocalDateTime.now(Util.zone());
		LocalDateTime vCExpireTime = vCTime.plusMinutes(vCDuration);

		UserVerification validation = new UserVerification();
		validation.setCode(code);
		validation.setUser(u);
		validation.setCreateTime(vCTime);
		validation.setExpireTime(vCExpireTime);
		em.persist(validation);

		em.flush();
	}

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

		String query = "SELECT u FROM User u WHERE u.active = 1 "
					   + (byMail ? "AND u.email = :username" : "AND u.username = :username");

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
