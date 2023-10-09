package com.tap.rest;

import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.Optional;

@RequestScoped
public class UtilRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public <T> Optional<T> getEntity(Class<T> ec, Object id) {
		try {
			T entity = em.find(ec, id);
			return Optional.of(entity);
		} catch (Exception e) {
			System.err.println(e);
			return Optional.empty();
		}
	}

	public <T> Optional<T> getSingleEntityBy(Class<T> ec, String key, Object value) {
		try {
			String query = String.format("""
					SELECT c FROM %s c
					WHERE c.%s = :value
					""", ec.getSimpleName(), key);

			return Optional.ofNullable(
					em.createQuery(query, ec)
							.setParameter("value", value)
							.getSingleResult()
			);
		} catch (Exception e) {
			System.err.println("ERROR FIND BY PARAM " + e);
			return Optional.empty();
		}
	}

}
