package com.tap.rest;

import com.tap.common.Util;
import com.tap.db.dto.UserDto;
import com.tap.db.entity.*;
import com.tap.security.Security;
import jakarta.enterprise.context.RequestScoped;
import jakarta.json.JsonObject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.ConfigProvider;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequestScoped
public class UserRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	@Transactional
	public int saveNewUser(String username, String email, String password, com.tap.security.Role r, String code) throws InvalidKeySpecException, NoSuchAlgorithmException {

		String salt = Util.getRandomString(16, true);
		String encryptedPass = Security.encryptPassword(password, salt);

		User u = new User();
		u.setUsername(username);
		u.setEmail(email);
		u.setPassword(encryptedPass);
		u.setSalt(salt);
		u.setCreateDate(Util.zonedNow());

		long vCDuration = ConfigProvider.getConfig().getValue("tap.verification.code.duration", Long.class);
		LocalDateTime vCTime = LocalDateTime.now(Util.zone());
		LocalDateTime vCExpireTime = vCTime.plusMinutes(vCDuration);

		UserVerification validation = new UserVerification();
		validation.setCode(code);
		validation.setUser(u);
		validation.setCreateTime(vCTime);
		validation.setExpireTime(vCExpireTime);

		Role role = this.getRole(r);
		UserRole uR = new UserRole();
		uR.setUser(u);
		uR.setRole(role);

		em.persist(u);
		em.persist(validation);
		em.persist(uR);
		em.flush();

		return u.getId();
	}

	public Map<String, Object> getUserData(int userId) {

		Map<String, Object> resp = new LinkedHashMap<>();

		User u = em.find(User.class, userId);
		if (u != null && u.getActive() == 1) {
			resp.put("id", u.getId());
			resp.put("username", u.getUsername());
			resp.put("email", u.getEmail());
			resp.put("phone", u.getPhone());
			resp.put("imagePath", u.getImgpath());
			resp.put("firstName", u.getFirstName());
			resp.put("lastName", u.getLastName());
			resp.put("state", u.getUserstate());
			resp.put("roles", getRoles(userId).stream().map(Role::getName).toList());
		}

		return resp;
	}

	@Transactional
	public void setUserData(int userId, UserDto userData) {
		User u = em.find(User.class, userId);
		if (u != null && u.getActive() == 1) {
			String username = userData.getUsername();
			String email = userData.getEmail();

			if (username != null && !username.isEmpty())
				u.setUsername(userData.getUsername());
			if (email != null && !email.isEmpty() && Util.isMail(email))
				u.setEmail(email);

			u.setFirstName(userData.getFirstName());
			u.setLastName(userData.getLastName());
			u.setPhone(userData.getPhone());

			em.persist(u);
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

	public Role getRole(com.tap.security.Role r) {
		return em.createQuery("SELECT r FROM Role r WHERE r.name = :name", Role.class)
				.setParameter("name", r.getName())
				.getSingleResult();
	}
}
