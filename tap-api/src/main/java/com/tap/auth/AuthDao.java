package com.tap.auth;

import com.tap.db.entity.Token;
import com.tap.db.entity.TokenStatus;
import com.tap.db.entity.User;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@RequestScoped
public class AuthDao {

	public static final short TOKEN_VALID = 1;
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	@Transactional
	public void saveToken(User u, String token) {

		String query = "SELECT t.id FROM Token t WHERE t.user.id = :userId AND t.token = :token";
		boolean tokenExist = !em.createQuery(query)
				.setParameter("userId", u.getId())
				.setParameter("token", token)
				.getResultList().isEmpty();

		if (!tokenExist) {
			Token t = new Token();
			TokenStatus tS = em.find(TokenStatus.class, TOKEN_VALID);
			t.setUser(u);
			t.setToken(token);
			t.setTokenstatus(tS);
			em.persist(t);
		}
	}
}
