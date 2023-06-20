package com.tap.provider;

import com.tap.db.entity.Provider;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;

import java.util.Arrays;
import java.util.List;

@RequestScoped
public class ProviderDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List getProviders() {
		String qS = """
				SELECT p.id, p.address.address1 FROM Provider p
				""";

		List<Tuple> list = em.createQuery(qS, Tuple.class).getResultList();

		return list;
	}
}
