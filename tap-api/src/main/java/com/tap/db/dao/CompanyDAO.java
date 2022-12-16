package com.tap.db.dao;

import com.tap.db.dto.CompanyBasicDTO;
import com.tap.db.entity.Company;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;

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
				""";

		return em.createQuery(query, CompanyBasicDTO.class).getResultList();
	}

	public CompanyBasicDTO getCompany(Long id) {
		String query = """
				SELECT new com.tap.db.dto.CompanyBasicDTO(c.id, c.name, c.typeName, a.street, a.number, a.longitude, a.latitude)
				FROM Company c JOIN c.address a
				WHERE c.active = 1
				AND
				c.id = :id
				""";
		TypedQuery<CompanyBasicDTO> q =  em.createQuery(query, CompanyBasicDTO.class);
		q.setParameter("id", id);
		return q.getSingleResult();
	}
}
