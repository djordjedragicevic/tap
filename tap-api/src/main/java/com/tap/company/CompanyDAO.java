package com.tap.company;

import com.tap.db.dto.*;
import com.tap.db.entity.Service;
import com.tap.db.entity.User;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

	public List<EmployeeDTO> getEmployeesForServices(long cityId, List<Long> sIds, long cId) {
		StringBuilder query = new StringBuilder("""
				SELECT DISTINCT e.id, e.user FROM Employee e
				INNER JOIN EmployeeService AS es ON es.employee.id = e.id
				INNER JOIN CompanyService AS cs ON cs.id = es.companyService.id
								
				WHERE e.company.active = 1
				AND e.company.approved = 1
				AND e.active = 1
				AND e.user.active = 1
				AND es.active = 1
				AND cs.active = 1
				AND cs.service.active = 1
								
				AND e.company.address.city.id = :cityId
				AND cs.service.id IN :sIds
				""");

		if (cId > 0)
			query.append(" AND e.company.id = :cId");

		TypedQuery<Object[]> q = em.createQuery(query.toString(), Object[].class)
				.setParameter("cityId", cityId)
				.setParameter("sIds", sIds);

		if (cId > 0)
			q.setParameter("cId", cId);

		List<EmployeeDTO> res = new ArrayList<>();
		List<Object[]> dbRes = q.getResultList();
		dbRes.forEach(r -> {
			User u = (User) r[1];
			res.add(new EmployeeDTO()
					.setId((Long) r[0])
					.setUser(new UserDTO()
							.setId(u.getId())
							.setFirstName(u.getFirstName())
							.setLastName(u.getLastName())
							.setUsername(u.getUsername())
					)
			);
		});

		return res;
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

	public List<EmployeeWorkDayDTO> getEmployeesWorkDays(List<Long> eIds) {
		String query = """
				SELECT
				start_day,
				start_time,
				end_day,
				end_time,
				break_start_day,
				break_start_time,
				break_end_day,
				break_end_time,
				e_id
				FROM tap.w_employee_wd
				WHERE ewd_active = 1
				AND cwd_active = 1
				AND e_id IN (%s)
				""";

		String in = String.join(",", eIds.stream().map(eId -> "?").toList());

		Query q = em.createNativeQuery(String.format(query, in));
		for (int i = 0, s = eIds.size(); i < s; i++)
			q.setParameter(i + 1, eIds.get(i));

		List<Object[]> dbRes = q.getResultList();

		return dbRes.stream().map(o -> new EmployeeWorkDayDTO()
				.setStartDay(Byte.parseByte(o[0].toString()))
				.setStartTime(LocalTime.parse(o[1].toString()))
				.setEndDay(Byte.parseByte(o[2].toString()))
				.setEndTime(LocalTime.parse(o[3].toString()))
				.setBreakStartDay(Byte.parseByte(o[4].toString()))
				.setBreakStartTime(LocalTime.parse(o[5].toString()))
				.setBreakEndDay(Byte.parseByte(o[6].toString()))
				.setBreakEndTime(LocalTime.parse(o[7].toString()))
				.setEmployeeId(Long.parseLong(o[8].toString()))
		).toList();
		//return dbRes;
	}
}
