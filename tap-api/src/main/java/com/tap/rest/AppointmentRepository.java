package com.tap.rest;

import com.tap.appointments.FreeAppointment;
import com.tap.appointments.Utils;
import com.tap.common.Util;
import com.tap.db.entity.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RequestScoped
public class AppointmentRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	@Transactional
	public boolean cancelAppointments(List<Long> aIds) {
		List<Appointment> apps = this.getAppointmentsById(aIds);

		if (apps.size() != aIds.size())
			return false;

		for (Appointment a : apps)
			if (a.getAppointmentstatus().getName().equals(AppointmentService.A_STATUS_REJECTED))
				return false;


		AppointmentStatus status = this.getAppointmentStatus(AppointmentService.A_STATUS_CANCELED);
		for (Appointment a : apps)
			a.setAppointmentstatus(status);

		em.flush();

		return true;
	}

	@Transactional
	public boolean rebookAppointments(List<Long> aIds) {
		List<Appointment> apps = this.getAppointmentsById(aIds);
		if (apps.size() != aIds.size())
			return false;

		Integer pId = apps.get(0).getEmployee().getProvider().getId();
		for (Appointment a : apps)
			if (!this.isFreeTime(pId, List.of(a.getEmployee().getId()), a.getStart(), a.getEnd()))
				return false;


		AppointmentStatus status = this.getAppointmentStatus(AppointmentService.A_STATUS_WAITING);
		for (Appointment a : apps)
			a.setAppointmentstatus(status);

		em.flush();

		return true;
	}

	@Transactional
	public boolean saveAppointment(FreeAppointment app, int userId) {

		List<Integer> eIds = app.getServices().stream().mapToInt(s -> s.getEmployee().getId()).boxed().toList();
		LocalDateTime from = LocalDateTime.of(app.getDate(), app.getServices().get(0).getTime());
		LocalDateTime to = from.plusMinutes(app.getDurationSum());

		boolean isFree = isFreeTime(app.getProviderId(), eIds, from, to);

		if (isFree) {
			AppointmentStatus aS = getAppointmentStatus(AppointmentService.A_STATUS_WAITING);
			User u = em.find(User.class, userId);
			app.getServices().sort(Comparator.comparing(FreeAppointment.Service::getTime));

			for (FreeAppointment.Service ser : app.getServices()) {
				Appointment fApp = new Appointment();
				Service s = em.find(Service.class, ser.getService().getId());
				Employee e = em.find(Employee.class, ser.getEmployee().getId());
				LocalDateTime start = LocalDateTime.of(app.getDate(), ser.getTime());
				LocalDateTime end = start.plusMinutes(ser.getService().getDuration());

				System.out.println(app.getDate() + "  ---  " + end);

				fApp.setStart(start);
				fApp.setEnd(end);
				fApp.setAppointmentstatus(aS);
				fApp.setEmployee(e);
				fApp.setService(s);
				fApp.setUser(u);
				fApp.setUser2(u);
				fApp.setCreateDate(LocalDateTime.now(Util.zone()));
				if (app.getServices().size() > 1)
					fApp.setJoinId(ser.getJoinId());

				em.persist(fApp);
			}
			
			return true;
		}
		return false;
	}

	public AppointmentStatus getAppointmentStatus(String name) {
		return em.createQuery("SELECT a FROM AppointmentStatus a WHERE a.name = :name", AppointmentStatus.class)
				.setParameter("name", name)
				.getSingleResult();
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
				SELECT a FROM Appointment a JOIN FETCH a.appointmentstatus status
				WHERE
				a.employee.id IN :eIds
				AND
				(status.name = :waiting OR status.name = :accepted)
				AND
				((a.start BETWEEN :from AND :to) OR (a.end BETWEEN :from AND :to) OR (a.start <= :from AND a.end >= :to))
				ORDER BY a.employee.id, a.start
				""";

		return em.createQuery(query, Appointment.class)
				.setParameter("eIds", eIds)
				.setParameter("waiting", AppointmentService.A_STATUS_WAITING)
				.setParameter("accepted", AppointmentService.A_STATUS_ACCEPTED)
				.setParameter("from", from)
				.setParameter("to", to)
				.getResultList();
	}

	public List<Map<String, Object>> getUserAppointments(Integer uId, boolean history) {

		String query = """
				SELECT
				a.id,
				a.joinId,
				a.start,
				a.end,
				status.name,
				s.id,
				s.name,
				s.duration,
				s.price,
				e.id,
				e.name,
				p.id AS pId,
				p.name,
				pT.name,
				add.address1,
				c.name,
				c.postCode
				FROM Appointment a
				JOIN a.service s
				JOIN a.appointmentstatus status
				JOIN a.employee e
				JOIN e.user u
				JOIN e.provider p
				JOIN p.address add
				JOIN add.city c
				JOIN p.providertype pT
				WHERE a.user.id = :uId
				AND a.end
				""";
		query = query
				+ (history ? " < " : " > ") + ":curr "
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
				"service.id",
				"service.name",
				"service.duration",
				"service.price",
				"employee.id",
				"employee.name",
				"provider.id",
				"provider.name",
				"provider.type",
				"provider.address1",
				"provider.city",
				"provider.postCode"
		));
	}


	public List<Appointment> getAppointmentsById(List<Long> aIds) {

		String query = "SELECT a FROM Appointment a WHERE a.id IN :ids ORDER BY a.start";

		return em.createQuery(query, Appointment.class)
				.setParameter("ids", aIds)
				.getResultList();
	}

	private boolean isFreeTime(Integer pId, List<Integer> eIds, LocalDateTime from, LocalDateTime to) {
		return getAppointmentsAtDay(eIds, from, to).isEmpty()
			   &&
			   getBusyPeriodsAtDay(pId, eIds, from, to).isEmpty();
	}
}
