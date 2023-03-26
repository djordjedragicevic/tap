package com.tap.appointments;

import com.tap.db.dto.AppointmentDTO;
import com.tap.db.entity.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;
import jakarta.ws.rs.core.Response;

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
//		StringBuilder q = new StringBuilder("""
//				SELECT new com.tap.db.dto.AppointmentDTO(
//				a.id,
//				a.user.id,
//				a.employee.id,
//				cs.service.id,
//				a.createdBy.id,
//				a.createIn,
//				a.start,
//				a.end,
//				a.comment)
//				FROM Appointment a
//				INNER JOIN CompanyService cs ON cs.id = a.employeeService.companyService.id
//				WHERE ((a.start BETWEEN :start AND :end) OR (a.end BETWEEN :start AND :end))
//				AND a.employeeService.active = 1
//				""");
		StringBuilder q = new StringBuilder("""
				SELECT new com.tap.db.dto.AppointmentDTO(
				a.id,
				a.user.id,
				a.employee.id,
				a.companyService.id,
				a.createdBy.id,
				a.createIn,
				a.start,
				a.end,
				a.comment)
				FROM Appointment a
				WHERE ((a.start BETWEEN :start AND :end) OR (a.end BETWEEN :start AND :end))
				""");

		boolean eIdsDefined = empIds != null && !empIds.isEmpty();

		if (eIdsDefined)
			q.append("AND a.employee.id IN :empIds");

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

	public Response bookAppointment(long eId, long csId, long uId, LocalDateTime start, LocalDateTime end) {

		CompanyService cs = em.find(CompanyService.class, csId);
		Employee e = em.find(Employee.class, eId);
		User u = em.find(User.class, uId);

		if (cs != null && e != null && u != null) {
			Appointment a = new Appointment()
					.setEmployee(e)
					.setCompanyService(cs)
					.setUser(u)
					.setCreatedBy(e.getUser())
					.setCreateIn(LocalDateTime.now())
					.setStart(start)
					.setEnd(end);
			em.persist(a);
			return Response.ok(true).build();
		} else {
			return Response.serverError().build();
		}
	}

}
