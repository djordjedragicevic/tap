package com.tap.db.dao;

import com.tap.db.dto.CompanyBasicDTO;
import com.tap.db.entity.Appointment;
import com.tap.db.entity.Service;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class AppointmentsDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<Appointment> getAppointments(Long companyId, Long duration) {
		String query = """
				SELECT new com.tap.db.dto.AppointmentDTO(a.id, s.id, e.id, u.id, a.createTime, a.startTime, a.endTime)
				FROM Appointment a
				JOIN a.service s
				JOIN a.employee e
				JOIN a.user u
				""";

		return em.createQuery(query, Appointment.class).getResultList();
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
