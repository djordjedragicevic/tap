package com.tap.db.dao;

import com.tap.db.dto.AppointmentDTO;
import com.tap.db.dto.CompanyBasicDTO;
import com.tap.db.entity.Appointment;
import com.tap.db.entity.Service;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class AppointmentsDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<Appointment> getAppointments(Long companyId, LocalDate date) {
		LocalDateTime start = date.atStartOfDay();
		String q = """
				SELECT a FROM Appointment a, CompanyWorkDay cWD
				WHERE cWD.company.id = :companyId
				AND cWD.active = 1
				AND cWD.day = :day
				
				AND a.company.id = :cId
				AND a.company.active = 1
				AND a.startTime BETWEEN :start AND :end
				""";

		TypedQuery<Appointment> tQ = em.createQuery(q, Appointment.class)
				.setParameter("day", start.getDayOfWeek().getValue())
				.setParameter("companyId", companyId)
				.setParameter("cId", companyId)
				.setParameter("start", start)
				.setParameter("end", start.plusDays(1));


		return tQ.getResultList();
	}

	public List<Service> getCompanyServices(Long companyId) {
		String query = """
				SELECT s.id, s.name, s.duration, s.price, c.id FROM Service s
				JOIN s.company c
				WHERE c.id = :companyId
				""";

		TypedQuery<Tuple> q = em.createQuery(query, Tuple.class);
		q.setParameter("companyId", companyId);

		List<Tuple> resDb = q.getResultList();
		List<Service> res = new ArrayList<>();

		resDb.forEach(r -> res.add(
				new Service()
						.setId(r.get(0, Long.class))
						.setName(r.get(1, String.class))
						.setDuration(r.get(2, Short.class))
						.setPrice(r.get(3, BigDecimal.class))
		));

		return res;
	}
}
