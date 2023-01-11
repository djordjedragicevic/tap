package com.tap.db.dao;

import com.tap.db.dto.*;
import com.tap.db.entity.Service;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

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


	public Object getWorkInfo(Long companyId) {

		String qWorkDays = """
				SELECT new com.tap.db.dto.CompanyWorkDay(cH.day, cH.open, cH.close) FROM CompanyHour cH
				WHERE cH.active = 1
				AND cH.company.active = 1
				AND cH.company.approved = 1
				AND cH.company.id = :companyId
				""";

		List<CompanyWorkDay> companyWorkDays = em.createQuery(qWorkDays, CompanyWorkDay.class)
				.setParameter("companyId", companyId)
				.getResultList();

		if (!companyWorkDays.isEmpty()) {

			String qEmployeeWorkDays = """
					SELECT cE.employee.id, cE.employee.firstName, cE.employee.lastName, eH.day, eH.start, eH.end, eH.breakStart, eH.breakEnd FROM CompanyEmployee cE
					INNER JOIN EmployeeHour eH ON eH.companyEmployee.id = cE.id
					WHERE cE.active = 1
					AND cE.company.id = :companyId
					""";

			List<Tuple> employeeTuples = em.createQuery(qEmployeeWorkDays, Tuple.class)
					.setParameter("companyId", companyId)
					.getResultList();

			List<EmployeeDTO> employeeWorkDays = new ArrayList<>();

			employeeTuples.forEach(t -> {
				EmployeeDTO cE = employeeWorkDays.stream().filter(c -> c.getId().longValue() == t.get(0, Long.class).longValue())
						.findFirst()
						.orElseGet(() -> {
							employeeWorkDays.add(new EmployeeDTO(
									t.get(0, Long.class),
									t.get(1, String.class),
									t.get(2, String.class)));

							return employeeWorkDays.get(employeeWorkDays.size() - 1);
						});

				cE.getWorkingHours().add(new EmployeeWorkDay(
						t.get(3, Byte.class),
						t.get(4, LocalTime.class),
						t.get(5, LocalTime.class),
						t.get(6, LocalTime.class),
						t.get(7, LocalTime.class))
				);
			});

			return new CompanyWorkInfoDTO()
					.setId(companyId)
					.setWorkDays(companyWorkDays)
					.setEmployees(employeeWorkDays);
		}

		return null;
	}
}
