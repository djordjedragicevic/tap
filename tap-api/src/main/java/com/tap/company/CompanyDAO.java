package com.tap.company;

import com.tap.db.dto.*;
import com.tap.db.entity.WEmployeeWD;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RequestScoped
public class CompanyDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;


	public List<Object> getCompaniesBasic() {
		String query = """
				SELECT new com.tap.db.dto.CompanyBasicDTO(c.id, c.name, c.typeName, a.street, a.number, a.longitude, a.latitude)
				FROM Company c JOIN c.address a
				WHERE c.active = 1
				AND c.approved = 1
				""";

		return em.createQuery(query, Object.class).getResultList();
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
				SELECT new com.tap.db.dto.ServiceDTO(s.id, ser.name, s.duration, s.price) FROM CompanyService s
				JOIN s.service ser
				WHERE s.company.id = :companyId
				AND s.company.approved = 1
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
				AND s.company.approved = 1
				AND s.active = 1
				AND s.id IN :ids
				""";

		return em.createQuery(query, Integer.class)
				.setParameter("companyId", companyId)
				.setParameter("ids", ids)
				.getResultList();
	}

	public List<EmployeeDTO> employeesForServices(long cityId, List<Long> sIds, long cId) {

		//*** Think about to include active working days of employee in conditions
		StringBuilder query = new StringBuilder("""
				SELECT DISTINCT e.id,
				e.user.id AS userId,
				e.user.firstName,
				e.user.lastName,
				e.user.username,
								
				e.company.name AS c_name,
				e.company.address.street AS c_street,
				e.company.address.number AS c_number,
								
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.id, ',') AS s_ids,
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.duration, ',') AS s_durations,
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.price, '#') AS s_prices,
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.service.name, ',') AS s_names
								
				FROM Employee e
								
				INNER JOIN EmployeeService AS es ON es.employee.id = e.id
				INNER JOIN CompanyService AS cs ON cs.id = es.companyService.id
				WHERE e.company.active = 1
				AND e.company.approved = 1
				AND e.active = 1
				AND e.user.active = 1
				AND es.active = 1
				AND cs.active = 1
				AND cs.service.active = 1
				AND cs.service.id IN :sIds
				""");

		if (cId > 0)
			query.append(" AND e.company.id = :cId");
		if (cityId > 0)
			query.append(" AND e.company.address.city.id = :cityId");

		query.append(" GROUP BY e.id");

		TypedQuery<Object[]> q = em.createQuery(query.toString(), Object[].class)
				.setParameter("cityId", cityId)
				.setParameter("sIds", sIds);

		if (cId > 0)
			q.setParameter("cId", cId);
		if (cityId > 0)
			q.setParameter("cityId", cityId);

		List<Object[]> dbRes = q.getResultList();

		return toListOfEmployeeDTOs(dbRes);
	}

	public List<EmployeeDTO> employeesOfCompany(long cId) {
		String query = """
				SELECT DISTINCT
				e.id,
				e.user.id AS userId,
				e.user.firstName,
				e.user.lastName,
				e.user.username,
				e.company.name AS c_name,
				e.company.address.street AS c_street,
				e.company.address.number AS c_number
				FROM Employee e
								
				WHERE e.company.active = 1
				AND e.company.approved = 1
				AND e.company.id = :cId
				AND e.active = 1
				AND e.user.active = 1
				""";

		TypedQuery<Object[]> q = em.createQuery(query, Object[].class).setParameter("cId", cId);
		List<Object[]> dbRes = q.getResultList();

		return toListOfEmployeeDTOs(dbRes);
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

	public List<WEmployeeWD> getEffEmployeesWorkDays(List<Long> eIds) {

		String query = """
				SELECT wd FROM WEmployeeWD wd
				WHERE wd.ewdActive = 1
				AND wd.cwdActive = 1
				AND wd.employeeId IN :eIds
				""";

		return em.createQuery(query, WEmployeeWD.class)
				.setParameter("eIds", eIds)
				.getResultList();
	}

	private static List<EmployeeDTO> toListOfEmployeeDTOs(List<Object[]> dbEmployees) {
		return dbEmployees.stream()
				.map(r -> {
							EmployeeDTO e = new EmployeeDTO()
									.setId(Long.parseLong(r[0].toString()))
									.setUser(new UserDTO(Long.parseLong(r[1].toString()), r[2].toString(), r[3].toString(), r[4].toString()));

							//Company
							String address = r[6] + (r[7] != null ? " " + r[7] : "");
							e.setCompany(new CompanyDTO(r[5].toString(), address));

							//Looking services
							if (r.length > 11) {

								String[] sIds = r[8].toString().split(",");
								String[] sDurations = r[9].toString().split(",");
								String[] sPrices = r[10].toString().split("#");
								String[] sNames = r[11].toString().split(",");

								List<ServiceDTO> services = new ArrayList<>();
								for (int i = 0, s = sIds.length; i < s; i++) {
									services.add(
											new ServiceDTO(
													Long.parseLong(sIds[i]),
													sNames[i],
													Integer.parseInt(sDurations[i]),
													BigDecimal.valueOf(Double.parseDouble(sPrices[i]))
											)
									);
								}

								e.setLookingServices(services);
							}


							return e;
						}
				).toList();
	}
}
