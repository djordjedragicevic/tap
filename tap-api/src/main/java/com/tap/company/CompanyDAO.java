package com.tap.company;

import com.tap.db.dto.*;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
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


	public List<CompanyServiceDTO> getCompanyServices(Long companyId) {
		String query = """
				SELECT new com.tap.db.dto.CompanyServiceDTO(s.id, ser.name, s.duration, s.price) FROM CompanyService s
				JOIN s.service ser
				WHERE s.company.id = :companyId
				AND s.company.approved = 1
				AND s.active = 1
				""";

		return em.createQuery(query, CompanyServiceDTO.class)
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
				e.company.typeName as c_type_name,
				e.company.address.street AS c_street,
				e.company.address.number AS c_number,
				e.company.address.city.country.name AS c_country,
				e.company.address.city.name AS c_city,
								
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.id, ',') AS s_ids,
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.duration, ',') AS s_durations,
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.price, '#') AS s_prices,
				SQL('GROUP_CONCAT(? SEPARATOR ?)', cs.service.name, ',') AS s_names,
				SQL('GROUP_CONCAT(? SEPARATOR ?)', es.id, ',') AS es_ids
								
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

		TypedQuery<Object[]> q = em.createQuery(query.toString(), Object[].class);

		q.setParameter("sIds", sIds);
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
				e.company.typeName as c_type_name,
				e.company.address.street AS c_street,
				e.company.address.number AS c_number,
				e.company.address.city.country.name AS c_country,
				e.company.address.city.name AS c_city
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

	public List getEffEmployeesWorkDays(List<Long> eIds) {

//		String query = """
//				SELECT wd FROM WEmployeeWD wd
//				WHERE wd.ewdActive = 1
//				AND wd.cwdActive = 1
//				AND wd.employeeId IN :eIds
//				""";
//
//		return em.createQuery(query, WEmployeeWD.class)
//				.setParameter("eIds", eIds)
//				.getResultList();
		return new ArrayList<>();
	}

	private static List<EmployeeDTO> toListOfEmployeeDTOs(List<Object[]> dbEmployees) {
		return dbEmployees.stream()
				.map(r -> {
							EmployeeDTO e = new EmployeeDTO()
									.setId(Long.parseLong(r[0].toString()))
									.setUser(new UserDTO(Long.parseLong(r[1].toString()), r[2].toString(), r[3].toString(), r[4].toString()));

							//Company
							String address = r[7] + (r[8] != null ? " " + r[8] : "");
							e.setCompany(new CompanyDTO(r[5].toString(), r[6].toString(), address, r[9].toString(), r[10].toString()));

							//Looking services
							if (r.length > 14) {

								String[] sIds = r[11].toString().split(",");
								String[] sDurations = r[12].toString().split(",");
								String[] sPrices = r[13].toString().split("#");
								String[] sNames = r[14].toString().split(",");
								String[] esIds = r[15].toString().split(",");

								List<CompanyServiceDTO> services = new ArrayList<>();
								List<EmployeeCompanyServiceDTO> employeeServices = new ArrayList<>();
								for (int i = 0, s = sIds.length; i < s; i++) {
									services.add(
											new CompanyServiceDTO(
													Long.parseLong(sIds[i]),
													sNames[i],
													Integer.parseInt(sDurations[i]),
													BigDecimal.valueOf(Double.parseDouble(sPrices[i]))
													//Long.parseLong(esIds[i])
											)
									);
									employeeServices.add(
											new EmployeeCompanyServiceDTO()
													.setId(Long.parseLong(esIds[i]))
									);
								}

								e.setLookingServices(services);
								e.setEmployeeServices(employeeServices);
							}


							return e;
						}
				).toList();
	}
}
