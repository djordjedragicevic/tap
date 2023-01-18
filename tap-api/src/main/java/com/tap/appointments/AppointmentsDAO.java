package com.tap.appointments;

import com.tap.db.entity.Service;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.sql.Struct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class AppointmentsDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<AppointmentDTO> getAppointments(Long companyId, LocalDateTime from, LocalDateTime to) {
		String q = """
				SELECT new com.tap.appointments.AppointmentDTO(a.id, a.employee.id, a.user.id, a.createdBy.id,a .service.id, a.company.id, a.createTime, a.startTime,a.endTime, a.comment) FROM Appointment a
				WHERE a.company.id = :companyId
				AND a.company.active = 1
				AND a.company.approved = 1
				AND a.startTime BETWEEN :start AND :end
				""";

		TypedQuery<AppointmentDTO> tQ = em.createQuery(q, AppointmentDTO.class)
				.setParameter("companyId", companyId)
				.setParameter("start", from)
				.setParameter("end", to);


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
						.setDuration(r.get(2, Integer.class))
						.setPrice(r.get(3, BigDecimal.class))
		));

		return res;
	}

	public Object getFreeAppointments(long cId, int services, LocalDateTime from , LocalDateTime to){
		String query = """
				SELECT a FROM Appointments
				WHERE a.company.id = :cId AND a.company.active = 1 AND a.company.approved = 1
				AND a.startTime BETWEEN :from AND :to
				""";

		List apps =  em.createQuery(query)
				.setParameter("cId", cId)
				.setParameter("from",from)
				.setParameter("to", to)
				.getResultList();

		return null;
	}
}
