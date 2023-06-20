package com.tap.provider;

import com.tap.db.entity.Provider;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

@RequestScoped
public class ProviderDAO {
	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;

	public List getProviders() {
		return em.createQuery("SELECT p FROM Provider p", Provider.class).getResultList();
	}
}
