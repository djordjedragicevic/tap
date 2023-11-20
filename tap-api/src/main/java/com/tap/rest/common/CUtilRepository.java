package com.tap.rest.common;

import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.*;

@RequestScoped
public class CUtilRepository {
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

	public <T> T getSingleEntityBy(Class<T> ec, Map<String, Object> params) {
		StringBuilder query = new StringBuilder();

		query.append(String.format("SELECT c FROM %s c WHERE", ec.getSimpleName()));

		int i = 1;
		List<Object> values = new ArrayList<>();
		for (Map.Entry<String, Object> k : params.entrySet()){
			query.append(" c.").append(k.getKey()).append(" = :val").append(i++);
			if((i - 1) < params.size())
				query.append(" AND");
			values.add(k.getValue());
		}

		TypedQuery<T> q = em.createQuery(query.toString(), ec);
		i = 1;
		for (Object v : values)
			q.setParameter("val" + i++, v);


		return q.getSingleResult();

	}
}