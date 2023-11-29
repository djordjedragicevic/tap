package com.tap.rest.business;

import com.tap.db.dtor.EmployeeDto;
import com.tap.db.dtor.ServiceDto;
import com.tap.db.dtor.ServiceWithEmployeesDto;
import com.tap.db.entity.Service;
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

	public List<ServiceDto> getServicesOfEmployee(Integer pId, Integer eId) {

		String query = """
				SELECT new com.tap.db.dtor.ServiceDto(s.id, s.name, g.name, s.duration, s.price) FROM Service s
				INNER JOIN ServiceEmployee se ON se.service.id = s.id
				LEFT JOIN s.group g
				WHERE s.active = 1 AND s.provider.id = :pId AND se.employee.id = :eId
				ORDER BY s.name
				""";

		return em.createQuery(query, ServiceDto.class)
				.setParameter("pId", pId)
				.setParameter("eId", eId)
				.getResultList();
	}

	public List<Service> getServicesByIds(Integer pId, List<Integer> sIds) {
		String query = """
				SELECT s FROM Service s
				WHERE s.active = 1 AND s.provider.id = :pId AND s.id IN :sIds
				""";

		return em.createQuery(query, Service.class)
				.setParameter("pId", pId)
				.setParameter("sIds", sIds)
				.getResultList();
	}
}
