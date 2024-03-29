package com.tap.rest.repository;

import com.tap.appointments.FreeAppointment;
import com.tap.appointments.Utils;
import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.rest.dto.AppointmentDto;
import com.tap.rest.dtor.AppointmentDtoSimple;
import com.tap.rest.entity.*;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@ApplicationScoped
public class AppointmentRepository extends CommonRepository {
	public List<AppointmentDtoSimple> getAppointmentsAtDayWAStatus(List<Integer> eIds, LocalDate date) {
		return this.getAppointmentsAtDayWAStatus(
				eIds,
				date.atTime(LocalTime.MIN),
				date.atTime(LocalTime.MAX)
		);
	}

	public List<AppointmentDtoSimple> getAppointmentsAtDayWAStatus(List<Integer> eIds, LocalDateTime from, LocalDateTime to) {
		return getAppointments(
				null,
				eIds,
				List.of(Statics.A_STATUS_WAITING, Statics.A_STATUS_ACCEPTED),
				from,
				to
		);
	}

	public List<Map<String, Object>> getUserAppointments(Integer uId, boolean history) {

		String query = """
				SELECT
				a.id, a.joinId, a.start, a.end,
				status.name,
				r.mark AS mark,
				s.id, s.name, s.duration, s.price, s.note,
				e.id, e.name,
				p.id AS pId, p.name, p.imagePath, pT.name,
				p.address.address1
				FROM Appointment a
				JOIN a.service s
				JOIN a.appointmentstatus status
				JOIN a.employee e
				JOIN e.user u
				JOIN e.provider p
				JOIN p.providertype pT
				LEFT JOIN Review r ON a = r.appointment
				WHERE a.user.id = :uId
				AND a.end
				""";
		query = query
				+ (history ? " < " : " > ") + ":curr "
				+ "GROUP BY a.id "
				+ "ORDER BY a.start, a.joinId";

		List<Object[]> apps = em.createQuery(query, Object[].class)
				.setParameter("uId", uId)
				.setParameter("curr", LocalDateTime.now(Util.zone()))
				.getResultList();

		return Util.convertToListOfMap(apps, List.of(
				"id",
				"joinId",
				"start",
				"end",
				"status",
				"mark",
				"service.id",
				"service.name",
				"service.duration",
				"service.price",
				"service.note",
				"employee.id",
				"employee.name",
				"provider.id",
				"provider.name",
				"provider.imagePath",
				"provider.type",
				"provider.address1"
		));
	}

	public Map<String, Object> getUserAppointmentByIdFlat(Long id, int uId) {

		String[] fields = new String[]{
				"a.id", "a.start", "a.end",
				"a.appointmentstatus.name AS status",
				"a.statusComment",

				"a.service.id AS serviceId",
				"a.service.name AS serviceName",
				"a.service.note AS serviceNote",
				"a.service.price AS servicePrice",
				"a.service.duration AS serviceDuration",

				"a.employee.id AS employeeId",
				"a.employee.name AS employeeName",

				"a.employee.provider.name AS providerName",
				"a.employee.provider.providertype.name AS providerType",
				"a.employee.provider.address.address1 AS providerAddress",

				"a.user.id AS userId",

				"r.mark AS mark",
				"r.comment AS reviewComment",
				"r.approvedAt AS reviewApprovedAt"
		};

		String query = """
				SELECT %s
				FROM Appointment a
				LEFT JOIN Review r ON a = r.appointment
				WHERE a.id = :id AND a.user.id = :uId
				""";

		Object[] res = this.getEntityManager().createQuery(String.format(query, String.join(",", fields)), Object[].class)
				.setParameter("id", id)
				.setParameter("uId", uId)
				.getSingleResult();

		return Util.convertToMap(res, Set.of("a"), fields);

	}


	public List<Appointment> getAppointmentsById(List<Long> aIds) {

		String query = "SELECT a FROM Appointment a WHERE a.id IN :ids ORDER BY a.start";

		return em.createQuery(query, Appointment.class)
				.setParameter("ids", aIds)
				.getResultList();
	}

	private static final String APP_PRE_QUERY = """
			SELECT new com.tap.rest.dtor.AppointmentDtoSimple(
			a.id, a.start, a.end,
			pt.name,
			u.id, u.username, u.email,
			s.id, s.name, s.price, s.duration,
			e.id, e.name, e.imagePath,
			g.name,
			c.name,
			status.name
			)
			FROM Appointment a
			JOIN a.appointmentstatus status
			JOIN a.periodtype pt
			JOIN a.employee e
			LEFT JOIN a.user u
			JOIN a.service s
			LEFT JOIN s.group g
			LEFT JOIN s.category c
			JOIN e.provider p
			""";

	public List<CustomPeriod> getCustomPeriodsAtDay(int pId, List<Integer> eIds, LocalDate date) {
		return getCustomPeriods(pId, eIds, date.atTime(LocalTime.MIN), date.atTime(LocalTime.MAX));
	}

	public List<CustomPeriod> getCustomPeriods(int pId, List<Integer> eIds, LocalDateTime from, LocalDateTime to) {

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


		String query = """
				SELECT bP
				FROM CustomPeriod bP LEFT JOIN FETCH bP.repeattype rT
				WHERE
				((bp.employee IS NOT NULL AND bP.employee.id IN :eIds) OR (bp.employee IS NULL AND bp.provider.id = :pId))
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

		TypedQuery<CustomPeriod> q = em.createQuery(query, CustomPeriod.class)
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
				.setParameter("everyYear", Utils.EVERY_YEAR)
				.setParameter("pId", pId)
				.setParameter("eIds", eIds);

		return q.getResultList();
	}

	public List<WorkInfo> getBreaksPeriodsAtDay(int pId, List<Integer> eIds, int day) {

		boolean hasEIds = eIds != null && !eIds.isEmpty();

		String query = """
				SELECT wi FROM WorkInfo wi
				WHERE
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

	public AppointmentStatus getAppointmentStatus(String name) {
		return em.createQuery("SELECT status FROM AppointmentStatus status WHERE status.name = :name", AppointmentStatus.class)
				.setParameter("name", name)
				.getSingleResult();
	}

	public List<AppointmentDtoSimple> getAppointments(Integer pId, List<Integer> eId, List<String> statuses, LocalDateTime from, LocalDateTime to) {

		Map<String, Object> qParams = new HashMap<>();

		StringBuilder sB = new StringBuilder(APP_PRE_QUERY);

		if (eId != null && !eId.isEmpty()) {
			if (eId.size() > 1) {
				sB.append(" WHERE e.id IN :eId");
				qParams.put("eId", eId);
			} else {
				sB.append(" WHERE e.id = :eId");
				qParams.put("eId", eId.get(0));
			}
		} else if (pId != null) {
			sB.append(" WHERE p.id = :pId");
			qParams.put("pId", pId);
		}

		if (statuses != null && !statuses.isEmpty()) {
			if (statuses.size() > 1) {
				sB.append(" AND status.name IN :status");
				qParams.put("status", statuses);
			} else {
				sB.append(" AND status.name = :status");
				qParams.put("status", statuses.get(0));
			}
		}

		if (from != null) {
			if (to != null) {
				sB.append(" AND ((a.start BETWEEN :from AND :to) OR (a.end BETWEEN :from AND :to) OR (a.start <= :from AND a.end >= :to))");
				qParams.put("from", from);
				qParams.put("to", to);

			} else {
				sB.append(" AND a.start > :from");
				qParams.put("from", from);
			}
		}

		sB.append(" ORDER BY e.id, a.start");

		TypedQuery<AppointmentDtoSimple> q = em.createQuery(sB.toString(), AppointmentDtoSimple.class);

		qParams.forEach(q::setParameter);

		return q.getResultList();
	}

	public List<AppointmentDtoSimple> getWaitingAppointments(Integer pId, LocalDateTime from) {
		return getAppointments(
				pId,
				null,
				List.of(Statics.A_STATUS_WAITING),
				from,
				null
		);
	}

	public List<AppointmentDtoSimple> getWAAppointmentsAtDay(List<Integer> eIds, LocalDate date) {
		return getAppointments(
				null,
				eIds,
				List.of(Statics.A_STATUS_ACCEPTED, Statics.A_STATUS_WAITING),
				date.atTime(LocalTime.MIN),
				date.atTime(LocalTime.MAX)
		);
	}


	public void acceptAppointment(Long appId, Integer sId, LocalDateTime now) {
		Appointment a = em.find(Appointment.class, appId);

		if (a == null || !sId.equals(a.getService().getId()))
			throw new TAPException(ErrID.TAP_0);

		int min = ConfigProvider.getConfig().getValue("tap.business.appointment.min_before_can_accept", Integer.class);
		if (!now.isBefore(a.getStart().minusMinutes(min)))
			throw new TAPException(ErrID.B_APP_ST_1);

		if (!a.getAppointmentstatus().getName().equals(Statics.A_STATUS_WAITING))
			throw new TAPException(ErrID.B_APP_ST_2, null, Map.of("status", a.getAppointmentstatus().getName()));

		AppointmentStatus appointmentStatus = getAppointmentStatus(Statics.A_STATUS_ACCEPTED);
		a.setAppointmentstatus(appointmentStatus);
		em.persist(a);
	}

	public void acceptAppointmentMulti(List<Long> appIds) {
		List<Appointment> apps = em.createQuery("SELECT a FROM Appointment a WHERE a.id IN :aIds", Appointment.class)
				.setParameter("aIds", appIds)
				.getResultList();

		AppointmentStatus status = getAppointmentStatus(Statics.A_STATUS_ACCEPTED);
		for (Appointment a : apps) {
			a.setAppointmentstatus(status);
			em.persist(a);
		}
	}

	public void rejectAppointment(Long appId, Integer sId, LocalDateTime now) {
		Appointment a = em.find(Appointment.class, appId);

		if (a == null || !sId.equals(a.getService().getId()))
			throw new TAPException(ErrID.TAP_0);

		List<Appointment> joinedApps;
		if (a.getJoinId() != null && !a.getJoinId().isEmpty()) {
			joinedApps = em.createQuery("SELECT a FROM Appointment a WHERE a.joinId = :joinId ORDER BY a.start", Appointment.class)
					.setParameter("joinId", a.getJoinId())
					.getResultList();
			a = joinedApps.get(0);
		} else {
			joinedApps = new ArrayList<>();
			joinedApps.add(a);
		}

		int min = ConfigProvider.getConfig().getValue("tap.business.appointment.min_before_can_accept", Integer.class);
		if (!now.isBefore(a.getStart().minusMinutes(min)))
			throw new TAPException(ErrID.B_APP_ST_1);

		if (!a.getAppointmentstatus().getName().equals(Statics.A_STATUS_WAITING))
			throw new TAPException(ErrID.B_APP_ST_2, null, Map.of("status", a.getAppointmentstatus().getName()));

		AppointmentStatus appointmentStatus = getAppointmentStatus(Statics.A_STATUS_REJECTED);
		for (Appointment app : joinedApps) {
			app.setAppointmentstatus(appointmentStatus);
			em.persist(app);
		}
	}

	//TODO Must fix this function, be aware of multi employees appointments
	public boolean isFreeTime(Integer pId, List<Integer> eIds, LocalDateTime from, LocalDateTime to) {
		return getAppointmentsAtDayWAStatus(eIds, from, to).isEmpty()
			   &&
			   getCustomPeriods(pId, eIds, from, to).isEmpty();
	}

}
