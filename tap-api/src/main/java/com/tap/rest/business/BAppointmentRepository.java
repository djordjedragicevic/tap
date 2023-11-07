package com.tap.rest.business;

import com.tap.db.dto.EmployeeDto;
import com.tap.db.entity.Employee;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
public class BAppointmentRepository {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

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
				SELECT a, s, e, u FROM Appointment a
				JOIN a.service s
				JOIN a.employee e
				JOIN a.user u
				WHERE
				a.employee.id IN :eIds
				AND
				((a.start BETWEEN :from AND :to) OR (a.end BETWEEN :from AND :to) OR (a.start <= :from AND a.end >= :to))
				ORDER BY a.employee.id, a.start
				""";

		return em.createQuery(query, Object[].class)
				.setParameter("eIds", eIds)
				.setParameter("from", from)
				.setParameter("to", to)
				.getResultList();
	}
}
