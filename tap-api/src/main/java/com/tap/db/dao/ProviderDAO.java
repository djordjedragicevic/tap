package com.tap.db.dao;

import com.tap.common.Util;
import com.tap.db.entity.Asset;
import com.tap.db.entity.Provider;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestScoped
public class ProviderDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public Object getProviders(long cityId) {
		String qS = """
				SELECT
				p.id,
				p.name,
				p.providertype.name,
				p.legalEntity,
				p.address.address1,
				p.address.city.name,
				FUNCTION('GROUP_CONCAT', a.location) AS mainImg
				FROM Provider p
				LEFT JOIN Asset a ON a.provider = p
				WHERE p.active = 1
				AND p.approved = 1
				AND p.providertype.active = 1
				AND p.address.city.active = 1
				AND p.address.city.id = :cityId
				GROUP BY p.id
				""";

		List<Object[]> dbRes = em.createQuery(qS, Object[].class)
				.setParameter("cityId", cityId)
				.getResultList();

		return Util.convertToListOfMap(dbRes,
				"id",
				"name",
				"type",
				"legalEntity",
				"address1",
				"city",
				"mainImg"
		);
	}

	public Map<String, Object> getProvider(long id) {
		Provider p = em.find(Provider.class, (int) id);
		Map<String, Object> resp = new HashMap<>();

		if (p.getActive() == 1) {
			resp.put("id", p.getId());
			resp.put("name", p.getName());
			resp.put("type", p.getProvidertype().getName());
			resp.put("address", p.getAddress().getAddress1());

			List<String> mainImg = em
					.createQuery(
							"""
									SELECT a.location AS mainImg
									FROM Asset a
									WHERE a.provider.id = :pId
									""",
							String.class
					)
					.setParameter("pId", id)
					.getResultList();

			resp.put("image", mainImg);
		}

		return resp;
	}

	public Object getProviderServices(long pId) {
		String query = """
				SELECT
				s.id,
				s.name,
				s.duration,
				s.durationTo,
				s.price,
				s.note,
				g.id,
				g.name,
				c.id,
				c.name
				FROM Service s LEFT JOIN s.group g LEFT JOIN s.category c
				WHERE s.active = 1
				AND s.provider.id = :pId
				ORDER BY c.id, g.id
				""";

		List<Object[]> dbRes = em.createQuery(query, Object[].class)
				.setParameter("pId", pId)
				.getResultList();

		return Util.convertToListOfMap(dbRes,
				"id",
				"name",
				"duration",
				"durationTo",
				"price",
				"note",
				"g_id",
				"g_name",
				"c_id",
				"c_name"
		);
	}

}
