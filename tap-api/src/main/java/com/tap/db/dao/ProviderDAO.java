package com.tap.db.dao;

import com.tap.appointments.Utils;
import com.tap.common.Util;
import com.tap.db.dto.EmployeeDTO;
import com.tap.db.dto.ServiceDTO;
import com.tap.db.entity.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObjectBuilder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RequestScoped
public class ProviderDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public Object getProviders(long cityId) {
		String qS = """
				SELECT
				p.id,
				p.name,
				pt.name,
				p.legalEntity,
				ad.address1,
				c.name,
				FUNCTION('GROUP_CONCAT', a.location) AS mainImg
				FROM Provider p
				LEFT JOIN Asset a ON a.provider = p
				JOIN p.providertype pt
				JOIN p.address ad
				JOIN ad.city c
				WHERE p.active = 1
				AND p.approved = 1
				AND pt.active = 1
				AND c.active = 1
				AND c.id = :cityId
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

	public List<Service> getServices(List<Integer> sIds) {
		return em.createQuery("SELECT s FROM Service s WHERE s.active = 1 AND s.id IN :sIds", Service.class)
				.setParameter("sIds", sIds)
				.getResultList();

	}

//	public List<ServiceEmployee> getActiveServiceEmployees(List<Integer> sIds, Integer pId) {
//		String query = """
//				SELECT DISTINCT
//				se
//				FROM ServiceEmployee se
//				JOIN se.service s
//				JOIN se.employee e
//				WHERE
//				s.active = 1 AND
//				e.active = 1 AND
//				se.service.id IN :sIds AND e.provider.id = :pId
//				""";
//
//		return em.createQuery(query, ServiceEmployee.class)
//				.setParameter("sIds", sIds)
//				.setParameter("pId", pId)
//				.getResultList();
//	}

	public Map<ServiceDTO, List<EmployeeDTO>> getActiveServiceEmployees(List<Integer> sIds, Integer pId) {
		String query = """
				SELECT DISTINCT
				se, s, e, g, u
				FROM ServiceEmployee se
				JOIN se.service s
				JOIN se.employee e
				JOIN s.group g
				JOIN e.user u
				WHERE
				s.active = 1 AND
				e.active = 1 AND
				se.service.id IN :sIds AND e.provider.id = :pId
				""";

		List<Object[]> dbResp = em.createQuery(query, Object[].class)
				.setParameter("sIds", sIds)
				.setParameter("pId", pId)
				.getResultList();

		Map<ServiceDTO, List<EmployeeDTO>> resp = new LinkedHashMap<>();
		Map<Service, ServiceDTO> sMap = new HashMap<>();

		for (Object[] r : dbResp) {
			Service s = (Service) r[1];
			Employee e = (Employee) r[2];
			Group g = (Group) r[3];
			User u = (User) r[4];

			ServiceDTO sDto = sMap.computeIfAbsent(s, k -> new ServiceDTO(
					k.getId(),
					k.getName(),
					k.getPrice().doubleValue(),
					k.getDuration(),
					g
			));

			resp.computeIfAbsent(sDto, k -> new ArrayList<>())
					.add(new EmployeeDTO(
							e.getId(),
							u.getFirstName(),
							u.getLastName()
					));
		}

		return resp;

	}

	public JsonArray getEmployeesOnServices(List<Integer> sIds, Integer pId) {

		JsonObjectBuilder jOB = Json.createObjectBuilder();
		JsonArrayBuilder jLB = Json.createArrayBuilder();
		String query = """
				SELECT
				se.service.id AS sId,
				s.active AS sActive,
				e.active AS eActive,
				s.name AS sName,
				e.id AS eId,
				s.duration AS dur
				FROM ServiceEmployee se
				JOIN se.service s
				JOIN se.employee e
				WHERE
				sActive = 1 AND
				eActive = 1 AND
				sId IN :sIds AND e.provider.id = :pId
				""";

		List<Object[]> dbResp = em.createQuery(query, Object[].class)
				.setParameter("sIds", sIds)
				.setParameter("pId", pId)
				.getResultList();
		for (Object[] r : dbResp) {
			jLB.add(
					jOB.add("sId", (int) r[0])
							.add("sName", (String) r[3])
							.add("eId", (int) r[4])
							.add("dur", (short) r[5])
							.build()
			);
		}

		return jLB.build();

	}

	public List<WorkPeriod> getWorkPeriodsAtDay(List<Integer> eIds, int pId, LocalDate date) {
		int day = date.getDayOfWeek().getValue();
		String query = """
				SELECT wp FROM WorkPeriod wp WHERE
				:day >= wp.startDay AND :day <= wp.endDay AND
				(wp.provider.id = :pId OR wp.employee IN :eIds)
				""";

		return em.createQuery(query, WorkPeriod.class)
				.setParameter("day", day)
				.setParameter("eIds", eIds)
				.setParameter("pId", pId)
				.getResultList();

	}

	public List<BusyPeriod> getBusyPeriodsAtDay(int pId, List<Integer> eIds, LocalDate date) {
		return getBusyPeriodsAtDay(pId, eIds, date.atTime(LocalTime.MIN), date.atTime(LocalTime.MAX));
	}

	public List<BusyPeriod> getBusyPeriodsAtDay(int pId, List<Integer> eIds, LocalDateTime from, LocalDateTime to) {

		String fromDate = from.toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
		String toDate = to.toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
		String fromTime = from.toLocalTime().format(DateTimeFormatter.ISO_LOCAL_TIME);
		String toTime = to.toLocalTime().format(DateTimeFormatter.ISO_LOCAL_TIME);
		int fromDay = from.getDayOfWeek().getValue() - 1;
		int toDay = to.getDayOfWeek().getValue() - 1;
		int fromMDay = from.getDayOfMonth();
		int toMDay = to.getDayOfMonth();
		int fromYDay = from.getDayOfYear();
		int toYDay = to.getDayOfYear();

		boolean hasPid = false;
		boolean hasEid = false;
		String q1 = " (";
		if (pId > 0) {
			hasPid = true;
			q1 += "bP.provider.id = :pId";
		}
		if (eIds != null && !eIds.isEmpty()) {
			hasEid = true;
			q1 += " OR bP.employee.id " + (eIds.size() > 1 ? "IN" : "=") + " :eIds";
		}
		q1 += ") ";

		String query = """
				SELECT bP
				FROM BusyPeriod bP LEFT JOIN FETCH bP.repeattype rT
				WHERE
				""";
		query += q1;
		query += """
				AND
				((function('TIME', bP.start) BETWEEN :fromTime AND :toTime) OR (function('TIME', bP.end) BETWEEN :fromTime AND :toTime) OR (function('TIME', bP.start) <= :fromTime AND function('TIME', bP.end) >= :toTime))
				AND(
				(rT IS NULL AND ((function('DATE', bP.start) BETWEEN :fromDate AND :toDate) OR (function('DATE', bP.end) BETWEEN :fromDate AND :toDate) OR (function('DATE', bP.start) <= :fromDate AND function('DATE', bP.end) >= :toDate)))
				OR
				(rT.name = :everyDay)
				OR
				(rT.name = :everyWeek AND ((function('WEEKDAY', bP.start) BETWEEN :fromDay AND :toDay) OR (function('WEEKDAY', bP.end) BETWEEN :fromDay AND :toDay) OR (function('WEEKDAY', bP.start) <= :fromDay AND function('WEEKDAY', bP.end) >= :toDay)))
				OR
				(rT.name = :everyMonth AND ((function('DAYOFMONTH', bP.start) BETWEEN :fromMDay AND :toMDay) OR (function('DAYOFMONTH', bP.end) BETWEEN :fromMDay AND :toMDay) OR (function('DAYOFMONTH', bP.start) <= :fromMDay AND function('DAYOFMONTH', bP.end) >= :toMDay)))
				OR
				(rT.name = :everyYear AND ((function('DAYOFYEAR', bP.start) BETWEEN :fromYDay AND :toYDay) OR (function('DAYOFYEAR', bP.end) BETWEEN :fromYDay AND :toYDay) OR (function('DAYOFYEAR', bP.start) <= :fromYDay AND function('DAYOFYEAR', bP.end) >= :toYDay)))
				)
				""";

		TypedQuery<BusyPeriod> q = em.createQuery(query, BusyPeriod.class)
				.setParameter("fromTime", fromTime)
				.setParameter("toTime", toTime)
				.setParameter("fromDate", fromDate)
				.setParameter("toDate", toDate)
				.setParameter("fromDay", fromDay)
				.setParameter("toDay", toDay)
				.setParameter("fromMDay", fromMDay)
				.setParameter("toMDay", toMDay)
				.setParameter("fromYDay", fromYDay)
				.setParameter("toYDay", toYDay)
				.setParameter("everyDay", Utils.EVERY_DAY)
				.setParameter("everyWeek", Utils.EVERY_WEEK)
				.setParameter("everyMonth", Utils.EVERY_MONT)
				.setParameter("everyYear", Utils.EVERY_YEAR);

		if (hasPid)
			q.setParameter("pId", pId);
		if (hasEid)
			q.setParameter("eIds", eIds.size() == 1 ? eIds.iterator().next() : eIds);

		return q.getResultList();
	}

	public List<Appointment> getAppointmentsAtDay(List<Integer> eIds, LocalDate date) {
		return getAppointmentsAtDay(eIds, date.atTime(LocalTime.MIN), date.atTime(LocalTime.MAX));
	}

	public List<Appointment> getAppointmentsAtDay(List<Integer> eIds, LocalDateTime from, LocalDateTime to) {

		String query = """
				SELECT a FROM Appointment a
				WHERE
				a.employee.id IN :eIds
				AND
				((a.start BETWEEN :from AND :to) OR (a.end BETWEEN :from AND :to) OR (a.start <= :from AND a.end >= :to))
				""";

		return em.createQuery(query, Appointment.class)
				.setParameter("eIds", eIds)
				.setParameter("from", from)
				.setParameter("to", to)
				.getResultList();
	}

}
