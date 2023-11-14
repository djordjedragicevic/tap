package com.tap.rest.common;

import com.tap.appointments.Utils;
import com.tap.db.entity.AppointmentStatus;
import com.tap.db.entity.BusyPeriod;
import com.tap.db.entity.WorkPeriod;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@ApplicationScoped
public class CAppointmentRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<BusyPeriod> getBusyPeriodsAtDay(int pId, List<Integer> eIds, LocalDate date) {
		return getBusyPeriods(pId, eIds, date.atTime(LocalTime.MIN), date.atTime(LocalTime.MAX));
	}

	public List<BusyPeriod> getBusyPeriods(int pId, List<Integer> eIds, LocalDateTime from, LocalDateTime to) {

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

	public List<WorkPeriod> getBreaksPeriodsAtDay(int pId, List<Integer> eIds, int day) {

		boolean hasEIds = eIds != null && !eIds.isEmpty();

		String query = """
				SELECT wp FROM WorkPeriod wp
				WHERE
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

	public AppointmentStatus getAppointmentStatusByName(String name) {
		return em.createQuery("SELECT status FROM AppointmentStatus status WHERE status.name = :name", AppointmentStatus.class)
				.setParameter("name", name)
				.getSingleResult();
	}
}
