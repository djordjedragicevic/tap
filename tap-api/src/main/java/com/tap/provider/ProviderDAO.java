package com.tap.provider;

import com.tap.common.Util;
import com.tap.db.entity.Provider;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RequestScoped
public class ProviderDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<Map<String, Object>> getProviders(long cityId) {
		String qS = """
				SELECT
				p.id,
				p.name,
				p.providertype.name,
				p.legalEntity,
				p.address.address1,
				p.address.city.name
				FROM Provider p
				WHERE p.active = 1
				AND p.approved = 1
				AND p.providertype.active = 1
				AND p.address.city.active = 1
				AND p.address.city.id = :cityId
				""";

		List<Object[]> dbRes = em.createQuery(qS, Object[].class)
				.setParameter("cityId", cityId)
				.getResultList();

		List<Map<String, Object>> reps = Util.convertToListOfMap(dbRes, "id", "name", "type", "legalEntity", "address1", "city");
		return reps;
	}

	public Object getProvider(long id) {
		Provider p = em.find(Provider.class, (int) id);
		return p.getActive() == 1 ? p : Map.of();
	}
}
