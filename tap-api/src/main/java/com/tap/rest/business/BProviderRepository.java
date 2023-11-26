package com.tap.rest.business;

import com.tap.db.dtor.EmployeeDto;
import com.tap.db.dtor.ServiceDto;
import com.tap.db.dtor.ServiceWithEmployeesDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.*;

@ApplicationScoped
public class BProviderRepository {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<ServiceWithEmployeesDto> getServicesWithEmployees(Integer pId) {
		String query = """
				SELECT s.id, s.name, g.name, e.id, e.name FROM ServiceEmployee se
				JOIN se.service s
				JOIN se.employee e
				JOIN e.provider p
				LEFT JOIN s.group g
				WHERE p.id = :pId
				AND s.active = 1 AND e.active = 1 AND p.active = 1
				""";

		List<Object[]> dbResp = em.createQuery(query, Object[].class)
				.setParameter("pId", pId)
				.getResultList();


		Map<Object, ServiceWithEmployeesDto> map = new LinkedHashMap<>();
		for (Object[] o : dbResp) {
			map.computeIfAbsent(o[0], key -> new ServiceWithEmployeesDto(key, o[1], o[2], new HashSet<>()))
					.employees()
					.add(new EmployeeDto(o[3], o[4], null));

		}

		return map.values().stream().toList();
	}

	public List<ServiceDto> getServicesIdName(Integer pId){
		return em.createQuery("SELECT new com.tap.db.dtor.ServiceDto(s.id, s.name, g.name) FROM Service s LEFT JOIN s.group g WHERE s.active = 1 AND s.provider.id = :pId", ServiceDto.class)
				.setParameter("pId", pId)
				.getResultList();
	}
}
