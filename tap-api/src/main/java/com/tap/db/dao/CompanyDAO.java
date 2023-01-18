package com.tap.db.dao;

import com.tap.db.dto.*;
import com.tap.db.entity.EmployeeWorkDay;
import com.tap.db.entity.Service;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RequestScoped
public class CompanyDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;


	public List<CompanyBasicDTO> getCompaniesBasic() {
		String query = """
				SELECT new com.tap.db.dto.CompanyBasicDTO(c.id, c.name, c.typeName, a.street, a.number, a.longitude, a.latitude)
				FROM Company c JOIN c.address a
				WHERE c.active = 1
				AND c.approved = 1
				""";

		return em.createQuery(query, CompanyBasicDTO.class).getResultList();
	}

	public CompanyBasicDTO getCompany(Long id) {
		String query = """
				SELECT new com.tap.db.dto.CompanyBasicDTO(c.id, c.name, c.typeName, a.street, a.number, a.longitude, a.latitude)
				FROM Company c JOIN c.address a
				WHERE c.active = 1
				AND c.approved = 1
				AND c.id = :id
				""";
		TypedQuery<CompanyBasicDTO> q = em.createQuery(query, CompanyBasicDTO.class);
		q.setParameter("id", id);

		return q.getSingleResult();
	}

	public List<EmployeeWorkDayDTO> getEmployeesWorkInfoAtDay(long companyId, int day) {

		String q = """
				SELECT new com.tap.db.dto.EmployeeWorkDayDTO (eWD.id, u.id, u.firstName, u.lastName, u.username, eWD.day, eWD.start, eWD.end, eWD.breakStart, eWD.breakEnd) 
				FROM EmployeeWorkDay eWD JOIN eWD.employee e JOIN e.user u
				WHERE eWD.employee.company.id = :companyId
				AND e.active = 1
				AND eWD.active = 1
				AND eWD.day = :day
				""";

		return em.createQuery(q, EmployeeWorkDayDTO.class)
				.setParameter("companyId", companyId)
				.setParameter("day", day)
				.getResultList();

	}

	public CompanyWorkDayDTO getCompanyWorkInfoAtDay(long companyId, int day) {
		String q = """
				SELECT new com.tap.db.dto.CompanyWorkDayDTO(cWD.company.id, cWD.day, cWD.start, cWD.end, cWD.breakStart, cWD.breakEnd) FROM CompanyWorkDay cWD
				WHERE cWD.active = 1
				AND cWD.day = :day
				AND cWD.company.id = :companyId
				""";

		return em.createQuery(q, CompanyWorkDayDTO.class)
				.setParameter("companyId", companyId)
				.setParameter("day", day)
				.getSingleResult();
	}


	public List<ServiceDTO> getCompanyServices(Long companyId) {
		String query = """
				SELECT new com.tap.db.dto.ServiceDTO(s.id, s.name, s.duration, s.price) FROM Service s
				WHERE s.company.id = :companyId
				AND s.company.id = 1
				AND s.active = 1
				""";

		return em.createQuery(query, ServiceDTO.class)
				.setParameter("companyId", companyId).
				getResultList();
	}

	public List<Integer> getServiceDurations(Long companyId, List<Long> ids) {
		String query = """
				SELECT s.duration FROM Service s
				WHERE s.company.id = :companyId
				AND s.company.id = 1
				AND s.active = 1
				AND s.id IN :ids
				""";

		return em.createQuery(query, Integer.class)
				.setParameter("companyId", companyId)
				.setParameter("ids", ids)
				.getResultList();
	}


//	public CompanyWorkInfoDTO getWorkInfo(Long companyId) {
//
//		String qWorkDays = """
//				SELECT new com.tap.db.dto.CompanyWorkDayDTO(cWD.day, cWD.start, cWD.end) FROM CompanyWorkDay cWD
//				WHERE cWD.active = 1
//				AND cWD.company.active = 1
//				AND cWD.company.approved = 1
//				AND cWD.company.id = :companyId
//				""";
//
//		List<CompanyWorkDayDTO> companyWorkDayDTOS = em.createQuery(qWorkDays, CompanyWorkDayDTO.class)
//				.setParameter("companyId", companyId)
//				.getResultList();
//
//		if (!companyWorkDayDTOS.isEmpty()) {
//
//			String qEmployeeWorkDays = """
//					SELECT e.user.id, e.user.firstName, e.user.lastName, eWD.day, eWD.start, eWD.end, eWD.breakStart, eWD.breakEnd FROM Employee e
//					INNER JOIN EmployeeWorkDayDTO eWD ON eWD.employee.id = e.user.id
//					WHERE e.active = 1
//					AND e.company.id = :companyId
//					""";
//
//			List<Tuple> employeeTuples = em.createQuery(qEmployeeWorkDays, Tuple.class)
//					.setParameter("companyId", companyId)
//					.getResultList();
//
//			List<UserDTO> employeeWorkDays = new ArrayList<>();
//
//			employeeTuples.forEach(t -> {
//				UserDTO cE = employeeWorkDays.stream().filter(c -> c.getId().longValue() == t.get(0, Long.class).longValue())
//						.findFirst()
//						.orElseGet(() -> {
//							employeeWorkDays.add(new UserDTO(
//									t.get(0, Long.class),
//									t.get(1, String.class),
//									t.get(2, String.class)));
//
//							return employeeWorkDays.get(employeeWorkDays.size() - 1);
//						});
//
//				cE.getWorkingHours().add(new EmployeeWorkDayDTO(
//						t.get(3, Byte.class),
//						t.get(4, LocalTime.class),
//						t.get(5, LocalTime.class),
//						t.get(6, LocalTime.class),
//						t.get(7, LocalTime.class))
//				);
//			});
//
//			return new CompanyWorkInfoDTO()
//					.setId(companyId)
//					.setWorkDays(companyWorkDayDTOS)
//					.setEmployees(employeeWorkDays);
//		}
//
//		return null;
//	}

	public List<EmployeeWorkDay> getEmployeesWorkDayInfo(long companyId, int d) {
		String q = """
				SELECT eWD FROM EmployeeWorkDay eWD
				WHERE eWD.employee.company.id = :cId
				AND eWD.employee.company.active = 1
				AND eWD.employee.company.approved = 1
				AND eWD.active = 1
				AND eWD.day = :d
				AND eWD.employee.active = 1
				""";
		return em.createQuery(q, EmployeeWorkDay.class)
				.setParameter("cId", companyId)
				.setParameter("d", d)
				.getResultList();
	}
}
