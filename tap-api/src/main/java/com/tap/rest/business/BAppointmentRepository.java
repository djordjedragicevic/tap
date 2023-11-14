package com.tap.rest.business;

import com.tap.common.Statics;
import com.tap.db.entity.Appointment;
import com.tap.db.entity.AppointmentStatus;
import com.tap.db.entity.Employee;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.common.CAppointmentRepository;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequestScoped
public class BAppointmentRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	@Inject
	CAppointmentRepository cAppointmentRepository;

	public List<Employee> getEmployees(int pId) {

		String query = """
				SELECT e FROM Employee e
				JOIN e.provider p
				WHERE e.active = 1 AND e.provider.id = :pId
				""";

		return em.createQuery(query, Employee.class)
				.setParameter("pId", pId)
				.getResultList();
	}

	public List<Object[]> getAppointmentsAtDay(List<Integer> eIds, LocalDate date) {
		return getAppointments(eIds, date.atTime(LocalTime.MIN), date.atTime(LocalTime.MAX));
	}

	public List<Object[]> getAppointments(List<Integer> eIds, LocalDateTime from, LocalDateTime to) {

		String query = """
				SELECT a, s, e, u, status.name FROM Appointment a
				JOIN a.service s
				JOIN a.employee e
				JOIN a.user u
				JOIN a.appointmentstatus status
				WHERE
				a.employee.id IN :eIds
				AND
				(status.name = :statusAccepted OR status.name = :statusWaiting)
				AND
				((a.start BETWEEN :from AND :to) OR (a.end BETWEEN :from AND :to) OR (a.start <= :from AND a.end >= :to))
				ORDER BY a.employee.id, a.start
				""";

		return em.createQuery(query, Object[].class)
				.setParameter("eIds", eIds)
				.setParameter("statusAccepted", Statics.A_STATUS_ACCEPTED)
				.setParameter("statusWaiting", Statics.A_STATUS_WAITING)
				.setParameter("from", from)
				.setParameter("to", to)
				.getResultList();
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

		AppointmentStatus appointmentStatus = cAppointmentRepository.getAppointmentStatusByName(Statics.A_STATUS_ACCEPTED);
		a.setAppointmentstatus(appointmentStatus);
		em.persist(a);
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

		AppointmentStatus appointmentStatus = cAppointmentRepository.getAppointmentStatusByName(Statics.A_STATUS_REJECTED);
		for (Appointment app : joinedApps) {
			app.setAppointmentstatus(appointmentStatus);
			em.persist(app);
		}
	}
}
