package com.tap.rest.business;

import com.tap.common.Util;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@ApplicationScoped
public class BServiceManagementRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public Object getServices(int pId) {
		String[] selector = new String[]{
				"service.id", "service.name", "service.duration", "service.price",
				"gr",
				"cat"
		};

		String query = """
				SELECT %s FROM Service service
				LEFT JOIN service.group gr
				LEFT JOIN service.category cat
				WHERE service.active = 1 AND service.provider.id = :pId
				""";

		List<Object[]> dbResp = em.createQuery(String.format(query, String.join(",", selector)), Object[].class)
				.setParameter("pId", pId)
				.getResultList();

		return Util.convertToListOfMap(dbResp, selector);
	}
}
