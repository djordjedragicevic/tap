package com.tap.common;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

public class UtilDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public <T> T getEntity (Class<T> ec, int id) {
		return em.find(ec, id);
	}

}
