package com.tap.rest.repository;

import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.rest.dto.*;
import com.tap.rest.dtor.ServiceWithEmployeesDto;
import com.tap.rest.entity.*;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.TypedQuery;

import java.time.format.DateTimeFormatter;
import java.util.*;

@ApplicationScoped
public class ProviderRepository extends CommonRepository {

	public Object getProviders(long cityId) {
		String qS = """
				SELECT
				p.id,
				p.name,
				p.mark,
				p.reviewCount,
				pt.name,
				p.legalEntity,
				ad.address1,
				c.name,
				FUNCTION('GROUP_CONCAT', a.location) AS mainImg
				FROM Provider p
				LEFT OUTER JOIN Asset a ON p.id = a.entityIdentifier
				LEFT OUTER JOIN a.assettype asType
				JOIN p.providertype pt
				JOIN p.address ad
				JOIN ad.city c
				WHERE p.active = 1
				AND p.approved = 1
				AND pt.active = 1
				AND c.active = 1
				AND c.id = :cityId
				AND (asType IS NULL OR asType.name = :asTypeName)
				GROUP BY p.id
				""";

		List<Object[]> dbRes = em.createQuery(qS, Object[].class)
				.setParameter("cityId", cityId)
				.setParameter("asTypeName", Statics.AT_PROVIDER_IMG)
				.getResultList();

		return Util.convertToListOfMap(dbRes,
				"id",
				"name",
				"mark",
				"reviewCount",
				"type",
				"legalEntity",
				"address1",
				"city",
				"mainImg"
		);
	}

	public Map<String, Object> getProviderData(int id) {
		String query = """
				SELECT
				p.id,
				p.name,
				p.phone,
				p.description,
				p.mark,
				p.reviewCount,
				t.name,
				a.address1,
				a.latitude,
				a.longitude,
				c.name,
				cou.name,
				cou.code
								
				FROM Provider p
				JOIN p.providertype t
				JOIN p.address a
				JOIN a.city c
				JOIN c.country cou
								
				WHERE p.active = 1 AND p.id = :id
				""";

		Object[] prov = em.createQuery(query, Object[].class)
				.setParameter("id", id)
				.getSingleResult();


		return Util.convertToMap(prov, "id", "name", "phone", "description", "mark", "reviewCount", "type", "address", "lat", "lon", "city", "country", "countryCode");

	}

	public List<String> getProviderMainImgs(int id) {

		String query = """
				SELECT a.location AS mainImg
				FROM Asset a
				JOIN a.assettype at
				WHERE a.entityIdentifier = :pId
				AND at.name = :aTName
				""";

		return em.createQuery(query, String.class)
				.setParameter("pId", id)
				.setParameter("aTName", Statics.AT_PROVIDER_IMG)
				.getResultList();
	}

	public List<Map<String, Object>> getProviderServices(long pId) {
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

//	public List<Map<String, Object>> getProviderServices(long pId) {
//		String query = """
//				SELECT
//				s.id,
//				s.name,
//				s.duration,
//				s.durationTo,
//				s.price,
//				s.note,
//				g.id,
//				g.name,
//				c.id,
//				c.name
//				FROM Service s LEFT JOIN s.group g LEFT JOIN s.category c
//				WHERE s.active = 1
//				AND s.provider.id = :pId
//				ORDER BY c.id, g.id
//				""";
//
//		List<Object[]> dbRes = em.createQuery(query, Object[].class)
//				.setParameter("pId", pId)
//				.getResultList();
//
//		return Util.convertToListOfMap(dbRes,
//				"id",
//				"name",
//				"duration",
//				"durationTo",
//				"price",
//				"note",
//				"g_id",
//				"g_name",
//				"c_id",
//				"c_name"
//		);
//	}

	public List<EmployeeDto> getProviderEmployeesDto(int pId) {
		String query = """
				SELECT e FROM Employee e
				WHERE e.active = 1 AND e.provider.id = :pId
				""";

		List<Employee> resp = em.createQuery(query, Employee.class)
				.setParameter("pId", pId)
				.getResultList();

		return resp.stream().map(e ->
				new EmployeeDto()
						.setId(e.getId())
						.setName(e.getName())
						.setImagePath(e.getImagePath())

		).toList();
	}

	public Map<ServiceDto, List<EmployeeDto>> getActiveServiceEmployees(List<Integer> sIds, Integer pId) {
		String query = """
				SELECT DISTINCT
				se, s, e, g
				FROM ServiceEmployee se
				JOIN se.service s
				JOIN se.employee e
				LEFT JOIN s.group g
				WHERE
				s.active = 1 AND
				e.active = 1 AND
				se.service.id IN :sIds AND e.provider.id = :pId
				""";

		List<Object[]> dbResp = em.createQuery(query, Object[].class)
				.setParameter("sIds", sIds)
				.setParameter("pId", pId)
				.getResultList();

		Map<ServiceDto, List<EmployeeDto>> resp = new LinkedHashMap<>();
		Map<Service, ServiceDto> sMap = new HashMap<>();

		for (Object[] r : dbResp) {
			Service s = (Service) r[1];
			Employee e = (Employee) r[2];
			Group g = (Group) r[3];

			ServiceDto sDto = sMap.computeIfAbsent(s, k ->
					new ServiceDto()
							.setId(k.getId())
							.setName(k.getName())
							.setPrice(k.getPrice())
							.setDuration(k.getDuration())
							.setGroup(g != null ? new GroupDto().setName(g.getName()) : null)
			);

			resp.computeIfAbsent(sDto, k -> new ArrayList<>())
					.add(new EmployeeDto()
							.setId(e.getId())
							.setName(e.getName())
					);
		}

		return resp;
	}

	public List<Map<String, Object>> getProviderWorkPeriods(int pId) {
		String query = """
				SELECT wi FROM WorkInfo wi WHERE
				wi.provider.id = :pId
				ORDER BY wi.day, wi.startTime
				""";

		List<WorkInfo> wPs = em.createQuery(query, WorkInfo.class)
				.setParameter("pId", pId)
				.getResultList();

		List<Map<String, Object>> resp = new ArrayList<>();
		for (WorkInfo wI : wPs)
			resp.add(Map.of(
					"id", wI.getId(),
					"day", wI.getDay(),
					"startTime", wI.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")),
					"endTime", wI.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"))
			));

		return resp;
	}

	public List<WorkInfo> getWorkInfoAtDay(List<Integer> eIds, int pId, int day) {

		boolean hasEIds = eIds != null && !eIds.isEmpty();

		String query = """
				SELECT wi FROM WorkInfo wi WHERE
				:day = wi.day AND
				(wi.provider.id = :pId
				""";

		if (hasEIds)
			query = query + " OR wi.employee IN :eIds";

		query = query + ")";

		TypedQuery<WorkInfo> jpaQuery = em.createQuery(query, WorkInfo.class)
				.setParameter("day", day)
				.setParameter("pId", pId);

		if (hasEIds)
			jpaQuery.setParameter("eIds", eIds);

		return jpaQuery.getResultList();
	}

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
					.add(new com.tap.rest.dtor.EmployeeDto(o[3], o[4], null));

		}

		return map.values().stream().toList();
	}

	public List<com.tap.rest.dtor.ServiceDto> getServicesOfEmployee(Integer eId) {

		String query = """
				SELECT new com.tap.rest.dtor.ServiceDto(s.id, s.name, g.name, s.duration, s.price) FROM Service s
				INNER JOIN ServiceEmployee se ON se.service.id = s.id
				LEFT JOIN s.group g
				JOIN se.employee e
				WHERE s.active = 1 AND se.employee.id = :eId AND e.active = 1
				ORDER BY s.name
				""";

		return em.createQuery(query, com.tap.rest.dtor.ServiceDto.class)
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

	public List<Employee> getProviderEmployees(int pId) {

		String query = """
				SELECT e FROM Employee e
				JOIN e.provider p
				WHERE e.active = 1
				AND e.provider.id = :pId
				ORDER BY e.name
				""";

		return em.createQuery(query, Employee.class)
				.setParameter("pId", pId)
				.getResultList();
	}

	public Map<String, Object> getEmployeeFullData(int uId) {

		String[] s = new String[]{
				"employee.id", "employee.name", "employee.imagePath",
				"employee.provider.id", "employee.provider.name",
				"employee.user.id", "employee.user.email"
		};

		String query = """
				SELECT
				%s
				FROM Employee employee
				JOIN employee.user user
				JOIN employee.provider provider
				WHERE user.id = :uId
				AND employee.active = 1
				AND user.active = 1
				AND provider.active = 1
				""";

		Object[] dbResp = em.createQuery(String.format(query, String.join(",", s)), Object[].class)
				.setParameter("uId", uId)
				.getSingleResult();

		return Util.convertToMap(dbResp, s);
	}
}
