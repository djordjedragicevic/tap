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
		return em.createQuery("SELECT a FROM Appointment a", Appointment.class).getResultList();
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
