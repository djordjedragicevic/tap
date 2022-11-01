package com.tap.db.dao;

import com.tap.db.dto.CompanyBasicDTO;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@RequestScoped
public class CompanyDAO {

	@PersistenceContext
	private EntityManager em;

	public List<CompanyBasicDTO> getCompaniesBasic() {
		String query = """
				SELECT new com.tap.db.dto.CompanyBasicDTO(c.id, c.name, c.typeName, a.street, a.number, a.longitude, a.latitude)
				FROM Company c JOIN c.address a
				WHERE c.active = 1
				""";

		return em.createQuery(query, CompanyBasicDTO.class).getResultList();
	}
}
