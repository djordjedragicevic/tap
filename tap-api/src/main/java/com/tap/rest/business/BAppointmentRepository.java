package com.tap.rest.business;

import com.tap.common.Statics;
import com.tap.db.dtor.AppointmentDtoSimple;
import com.tap.db.entity.Appointment;
import com.tap.db.entity.AppointmentStatus;
import com.tap.db.entity.Employee;
import com.tap.exception.ErrID;
import com.tap.exception.TAPException;
import com.tap.rest.common.CAppointmentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.eclipse.microprofile.config.ConfigProvider;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@ApplicationScoped
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

	public List<AppointmentDtoSimple> getWaitingAppointments(Integer pId, LocalDateTime from) {
		return cAppointmentRepository.getAppointments(
				pId,
				null,
				List.of(Statics.A_STATUS_WAITING),
				from,
				null
		);
	}

	public List<AppointmentDtoSimple> getWaitingAppointmentsForEmployee(Integer pId, Integer eId, LocalDateTime from) {
		return cAppointmentRepository.getAppointments(
				pId,
				List.of(eId),
				List.of(Statics.A_STATUS_WAITING),
				from,
				null
		);
	}

	public List<AppointmentDtoSimple> getWAAppointmentsAtDay(List<Integer> eIds, LocalDate date) {
		return cAppointmentRepository.getAppointments(
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

		AppointmentStatus appointmentStatus = cAppointmentRepository.getAppointmentStatus(Statics.A_STATUS_ACCEPTED);
		a.setAppointmentstatus(appointmentStatus);
		em.persist(a);
	}

	public void acceptAppointmentMulti(List<Long> appIds) {
		List<Appointment> apps = em.createQuery("SELECT a FROM Appointment a WHERE a.id IN :aIds", Appointment.class)
				.setParameter("aIds", appIds)
				.getResultList();

		AppointmentStatus status = cAppointmentRepository.getAppointmentStatus(Statics.A_STATUS_ACCEPTED);
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

		AppointmentStatus appointmentStatus = cAppointmentRepository.getAppointmentStatus(Statics.A_STATUS_REJECTED);
		for (Appointment app : joinedApps) {
			app.setAppointmentstatus(appointmentStatus);
			em.persist(app);
		}
	}


}
