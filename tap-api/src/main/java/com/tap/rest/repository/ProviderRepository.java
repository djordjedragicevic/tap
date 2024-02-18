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

	public List<Map<String, Object>> getReviews(int pId, String sortBy, String sortKey) {
		String[] fields = new String[]{
				"r.id", "r.mark", "r.comment",
				"r.user.username AS username",
				"r.appointment.service.name AS service",
				"r.createdAt"
		};

		String query = """
				SELECT %s FROM Review r
				WHERE r.user2 IS NOT NULL AND r.provider.id = :pId
				ORDER BY r.%s %s
				""";

		List<Object[]> dbReps = this.getEntityManager()
				.createQuery(String.format(query, String.join(",", fields), sortBy, sortKey), Object[].class)
				.setParameter("pId", pId)
				.getResultList();

		return Util.convertToListOfMap(dbReps, fields, "r");
	}

	public List<Map<String, Object>> getProviders(Integer typeId) {
		String[] fields = new String[]{
				"p.id", "p.name", "p.imagePath AS mainImg", "p.legalEntity",
				"p.providertype.name AS providerType", "p.providertype.imagePath AS providerTypeImage",
				"p.address.address1 AS address1",
				"ROUND(AVG(r.mark), 1) AS mark",
				"COUNT(r.id) AS reviewCount"
		};

		String qS = """
				SELECT
				%s
				FROM Provider p
				LEFT JOIN Review r ON p = r.provider
				WHERE p.active = 1
				AND p.providertype.active = 1
				AND p.providertype.id = :pId
				AND p.approvedAt IS NOT NULL
				GROUP BY p.id
				ORDER BY p.id
				""";

		List<Object[]> dbRes = em.createQuery(String.format(qS, String.join(",", fields)), Object[].class)
				.setParameter("pId", typeId)
				.getResultList();

		return Util.convertToListOfMap(dbRes, fields, "p");

	}

	public List<Map<String, Object>> getProviderTypes() {
		String[] fields = new String[]{
				"pt.id", "pt.name", "pt.imagePath",
				"COUNT(p) AS providerCount"
		};

		String query = """
				SELECT %s
				FROM ProviderType pt
				LEFT JOIN Provider p ON pt = p.providertype
				WHERE pt.active = 1
				GROUP BY pt.id
				ORDER BY providerCount DESC
				""";

		List<Object[]> dbResp = em.createQuery(String.format(query, String.join(",", fields)), Object[].class)
				.getResultList();

		return Util.convertToListOfMap(dbResp, fields, "pt");
	}

	public Map<String, Object> getProviderData(int id) {
		String[] fields = new String[]{
				"p.id", "p.name", "p.phone", "p.description", "p.imagePath AS mainImg",
				"p.providertype.name AS providerType","p.providertype.imagePath AS providerTypeImage",
				"p.address.address1 AS address", "p.address.latitude AS lat", "p.address.longitude AS lon",
				"p.address.city.country.name AS country", "p.address.city.country.code AS countryCode",
				"ROUND(AVG(r.mark), 1) AS mark",
				"COUNT(r.id) AS reviewCount"
		};

		String query = """
				SELECT
				%s
				FROM Provider p
				LEFT JOIN Review r ON p = r.provider
				WHERE p.active = 1
				AND p.id = :id
				AND p.providertype.active = 1
				AND p.address.city.active = 1
				GROUP BY p.id
				""";

		Object[] prov = em.createQuery(String.format(query, String.join(",", fields)), Object[].class)
				.setParameter("id", id)
				.getSingleResult();

		return Util.convertToMap(prov, fields, "p");

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
				FROM Service s
				LEFT JOIN s.group g LEFT JOIN s.category c
				LEFT JOIN ServiceEmployee se ON s = se.service
				WHERE s.active = 1
				AND s.provider.id = :pId
				GROUP BY s.id
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
				SELECT wi FROM WorkInfo wi
				WHERE wi.provider.id = :pId
				AND wi.periodtype.name = :periodName
				AND wi.periodtype.active = 1
				ORDER BY wi.day, wi.startTime
				""";

		List<WorkInfo> wPs = em.createQuery(query, WorkInfo.class)
				.setParameter("pId", pId)
				.setParameter("periodName", Statics.PT_WI_PROVIDER_WORK)
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
