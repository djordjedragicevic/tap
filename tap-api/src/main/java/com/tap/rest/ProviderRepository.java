package com.tap.rest;

import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.db.dto.*;
import com.tap.db.entity.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RequestScoped
public class ProviderRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

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
				AND (asType IS NULL OR asType.name = :asTypeName )
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

	public List<EmployeeDto> getProviderEmployees(int pId) {
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
				JOIN s.group g
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
				SELECT wp FROM WorkPeriod wp WHERE
				wp.provider.id = :pId
				ORDER BY wp.day, wp.startTime
				""";

		List<WorkPeriod> wPs = em.createQuery(query, WorkPeriod.class)
				.setParameter("pId", pId)
				.getResultList();

		List<Map<String, Object>> resp = new ArrayList<>();
		for (WorkPeriod wP : wPs)
			resp.add(Map.of(
					"id", wP.getId(),
					"day", wP.getDay(),
					"startTime", wP.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")),
					"endTime", wP.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm"))
			));
		//			resp.add(new WorkPeriodDto()
//					.setId(wP.getId())
//					.setDay(wP.getDay())
//					.setStartTime(wP.getStartTime())
//					.setEndTime(wP.getEndTime())
//			);

		return resp;
	}

	public List<WorkPeriod> getWorkPeriodsAtDay(List<Integer> eIds, int pId, int day) {

		boolean hasEIds = eIds != null && !eIds.isEmpty();

		String query = """
				SELECT wp FROM WorkPeriod wp WHERE
				:day = wp.day AND
				(wp.provider.id = :pId
				""";

		if (hasEIds)
			query = query + " OR wp.employee IN :eIds";

		query = query + ")";

		TypedQuery<WorkPeriod> jpaQuery = em.createQuery(query, WorkPeriod.class)
				.setParameter("day", day)
				.setParameter("pId", pId);

		if (hasEIds)
			jpaQuery.setParameter("eIds", eIds);

		return jpaQuery.getResultList();
	}
}
