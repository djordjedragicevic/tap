package com.tap.db.dao;

import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@RequestScoped
public class UtilDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public <T> T getEntity (Class<T> ec, Object id) {
		return em.find(ec, id);
	}

}
