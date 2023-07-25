package com.tap.db.dao;

import com.tap.db.entity.Token;
import com.tap.db.entity.TokenStatus;
import com.tap.db.entity.User;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@RequestScoped
public class AuthDAO {

	public static final short TOKEN_VALID = 1;
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	@Transactional
	public Token createTokenRecord(int userId) {

		User u = em.find(User.class, userId);
		Token t = new Token();
		TokenStatus tS = em.find(TokenStatus.class, TOKEN_VALID);
		t.setUser(u);
		t.setTokenstatus(tS);
		em.persist(t);

		return t;
	}

	@Transactional
	public void setTokenJTI(Object tokenId, String tokenJTI) {
		Token t = em.find(Token.class, tokenId);
		t.setJti(tokenJTI);
	}

	public Token getToken(long userId, String tokenId) {
		try {

			return em.createQuery("SELECT t FROM Token t WHERE t.user.is = :uId AND t.jti = :tId", Token.class)
					.setParameter("uId", userId)
					.setParameter("tId", tokenId)
					.getSingleResult();

		} catch (Exception e) {
			return null;
		}
	}
}
