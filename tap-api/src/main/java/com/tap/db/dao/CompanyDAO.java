package com.tap.db.dao;

import com.tap.db.entity.Company;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@RequestScoped
public class CompanyDAO {

	@PersistenceContext
	private EntityManager em;

	public List<Company> getCompanies() {
		return em.createQuery("SELECT c from Company c", Company.class).getResultList();
	}
}
