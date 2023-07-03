package com.tap.provider;

import com.tap.common.Util;
import com.tap.db.entity.Provider;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

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
				p.mainImg,
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

		return Util.convertToListOfMap(dbRes,
				"id",
				"name",
				"mainImg",
				"type",
				"legalEntity",
				"address1",
				"city"
		);
	}

	public Map<String, Object> getProvider(long id) {
		Provider p = em.find(Provider.class, (int) id);

		return p.getActive() == 1 ?
				Map.of(
						"id", p.getId(),
						"name", p.getName(),
						"type", p.getProvidertype().getName(),
						"address", p.getAddress().getAddress1(),
						"image", p.getMainImg()
				) :
				Map.of();
	}

	public Object getProviderServices(long pId) {
		String query = """
				SELECT
				s.id,
				s.name,
				s.duration,
				s.price,
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
				"price",
				"g_id",
				"g_name",
				"c_id",
				"c_name"
		);
	}

}
