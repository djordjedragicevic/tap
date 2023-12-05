package com.tap.rest.common;

import com.tap.common.Util;
import com.tap.db.entity.Role;
import com.tap.db.entity.User;
import com.tap.security.Security;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class CUserRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;
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
	public List<String> getRoleNames(int userId) {

		return em.createQuery("SELECT r.name FROM Role r INNER JOIN UserRole uR ON r = uR.role WHERE uR.user.id = :uId", String.class)
				.setParameter("uId", userId)
				.getResultList();
	}

}
