package com.tap.appointments;

import com.tap.db.entity.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.sql.Struct;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class AppointmentsDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<AppointmentDTO> getAppointments(Long companyId, LocalDateTime from, LocalDateTime to) {
		String q = """
				SELECT new com.tap.appointments.AppointmentDTO(a.id, a.employee.id, a.user.id, a.createdBy.id, a.service.id, a.employee.company.id, a.createTime, a.startTime,a.endTime, a.comment) FROM Appointment a
				WHERE a.employee.company.id = :companyId
				AND a.employee.company.active = 1
				AND a.employee.company.approved = 1
				AND a.startTime BETWEEN :start AND :end
				""";
		System.out.println(from + "  " + to);
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

//		resDb.forEach(r -> res.add(
//				new Service()
//						.setId(r.get(0, Long.class))
//						.setName(r.get(1, String.class))
//						.setDuration(r.get(2, Integer.class))
//						.setPrice(r.get(3, BigDecimal.class))
//		));

		return res;
	}

	public void bookAppointment(List<Long> sIds, long uId, long eId, LocalDateTime start, LocalDateTime end) {
		if (em != null) {
			User u = em.find(User.class, uId);
			Employee e = em.find(Employee.class, eId);
			for (Long sId : sIds) {
				Service s = em.find(Service.class, sId);
				Appointment a = new Appointment()
						.setService(s)
						.setUser(u)
						.setEmployee(e)
						.setCreatedBy(u)
						.setCreateTime(LocalDateTime.now())
						.setStartTime(start)
						.setEndTime(end);
				em.persist(a);
			}
		}
	}

}
