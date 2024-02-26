package com.tap.rest.repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.*;

@ApplicationScoped
@Named("commonRepository")
public class CommonRepository {

	@PersistenceContext(unitName = "tap-pu")
	protected EntityManager em;

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
			return Optional.empty();
		}
	}

	public <T> T getSingleActiveEntityById(Class<T> ec, Object id) {
		return getSingleEntityBy(ec, Map.of("active", (byte) 1, "id", id));
	}

	public <T> T getSingleEntityBy(Class<T> ec, Map<String, Object> params) {
		return this.createQuery(ec, params).getSingleResult();
	}

	public <T> T getSingleEntityBy(Class<T> ec, Object... params) {
		return this.createQuery(ec, params).getSingleResult();
	}

	public <T> List<T> getEntityListByIds(Class<T> ec, List<?> ids) {
		String query = String.format("""
				SELECT c FROM %s c
				WHERE c.id IN :ids
				""", ec.getSimpleName());

		return em.createQuery(query, ec).setParameter("ids", ids).getResultList();
	}

	public <T> List<T> getEntityListBy(Class<T> ec, Object... params) {
		return createQuery(ec, params).getResultList();
	}

	public <T> T getEntityBy(Class<T> ec, Object... params) {
		return createQuery(ec, params).getSingleResult();
	}

	public <T> T getNullableEntityBy(Class<T> ec, Object... params) {
		try {
			return createQuery(ec, params).getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
	}


	public EntityManager getEntityManager() {
		return em;
	}

	private <T> TypedQuery<T> createQuery(Class<T> ec, Map<String, Object> params) {
		StringBuilder query = new StringBuilder();

		query.append(String.format("SELECT c FROM %s c WHERE", ec.getSimpleName()));

		int i = 1;
		List<Object> values = new ArrayList<>();
		for (Map.Entry<String, Object> k : params.entrySet()) {
			query.append(" c.").append(k.getKey()).append(" = :val").append(i++);
			if ((i - 1) < params.size())
				query.append(" AND");
			values.add(k.getValue());
		}

		TypedQuery<T> q = em.createQuery(query.toString(), ec);
		i = 1;
		for (Object v : values)
			q.setParameter("val" + i++, v);

		return q;
	}

	private <T> TypedQuery<T> createQuery(Class<T> ec, Object... params) {

		List<String> sqlParts = new ArrayList<>();
		Map<String, Object> sqlParams = new HashMap<>();
		for (int i = 0, s = params.length; i < s; i += 2) {
			sqlParts.add("c." + params[i].toString() + " = :val" + i);
			sqlParams.put("val" + i, params[i + 1]);
		}

		String query = "SELECT c FROM %s c WHERE %s";
		String ands = String.join(" AND ", sqlParts);

		TypedQuery<T> q = em.createQuery(String.format(query, ec.getSimpleName(), ands), ec);
		for (Map.Entry<String, Object> en : sqlParams.entrySet())
			q.setParameter(en.getKey(), en.getValue());

		return q;
	}
}
