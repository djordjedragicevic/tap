package com.tap.rest;

import com.tap.appointments.FreeAppointment;
import com.tap.common.Statics;
import com.tap.common.Util;
import com.tap.db.dtor.AppointmentDtoSimple;
import com.tap.db.entity.*;
import com.tap.rest.common.CAppointmentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@ApplicationScoped
public class AppointmentRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;
	@Inject
	private CAppointmentRepository cAppointmentRepository;

	@Transactional
	public boolean cancelAppointments(List<Long> aIds) {
		List<Appointment> apps = this.getAppointmentsById(aIds);

		if (apps.size() != aIds.size())
			return false;

		for (Appointment a : apps)
			if (a.getAppointmentstatus().getName().equals(Statics.A_STATUS_REJECTED))
				return false;


		AppointmentStatus status = cAppointmentRepository.getAppointmentStatus(Statics.A_STATUS_CANCELED);
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


		AppointmentStatus status = cAppointmentRepository.getAppointmentStatus(Statics.A_STATUS_WAITING);
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
			AppointmentStatus aS = cAppointmentRepository.getAppointmentStatus(Statics.A_STATUS_WAITING);
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

	public List<AppointmentDtoSimple> getAppointmentsAtDayWAStatus(List<Integer> eIds, LocalDate date) {
		return this.getAppointmentsAtDayWAStatus(
				eIds,
				date.atTime(LocalTime.MIN),
				date.atTime(LocalTime.MAX)
		);
	}

	public List<AppointmentDtoSimple> getAppointmentsAtDayWAStatus(List<Integer> eIds, LocalDateTime from, LocalDateTime to) {
		return cAppointmentRepository.getAppointments(
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
		return getAppointmentsAtDayWAStatus(eIds, from, to).isEmpty()
			   &&
			   cAppointmentRepository.getBusyPeriods(pId, eIds, from, to).isEmpty();
	}
}
