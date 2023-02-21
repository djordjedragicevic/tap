package com.tap.appointments;

import com.tap.db.dto.AppointmentDTO;
import com.tap.db.entity.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class AppointmentsDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List<AppointmentDTO> getAppointments(LocalDateTime from, LocalDateTime to, List<Long> empIds) {
		StringBuilder q = new StringBuilder("""
				SELECT new com.tap.db.dto.AppointmentDTO(
				a.id,
				a.user.id,
				a.employeeService.id,
				a.employeeService.employee.id,
				cs.service.id,
				a.createdBy.id,
				a.createIn,
				a.start,
				a.end,
				a.comment)
				FROM Appointment a
				INNER JOIN CompanyService cs ON cs.id = a.employeeService.companyService.id
				WHERE ((a.start BETWEEN :start AND :end) OR (a.end BETWEEN :start AND :end))
				AND a.employeeService.active = 1
				""");

		boolean eIdsDefined = empIds != null && !empIds.isEmpty();

		if (eIdsDefined)
			q.append("AND a.employeeService.employee.id IN :empIds");

		TypedQuery<AppointmentDTO> tQ = em.createQuery(q.toString(), AppointmentDTO.class)
				.setParameter("start", from)
				.setParameter("end", to);

		if (eIdsDefined)
			tQ.setParameter("empIds", empIds);

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
//		if (em != null) {
//			User u = em.find(User.class, uId);
//			Employee e = em.find(Employee.class, eId);
//			for (Long sId : sIds) {
//				Service s = em.find(Service.class, sId);
//				Appointment a = new Appointment()
//						.setService(s)
//						.setUser(u)
//						.setEmployee(e)
//						.setCreatedBy(u)
//						.setCreateIn(LocalDateTime.now())
//						.setStart(start)
//						.setEnd(end);
//				em.persist(a);
//			}
//		}
	}

}
