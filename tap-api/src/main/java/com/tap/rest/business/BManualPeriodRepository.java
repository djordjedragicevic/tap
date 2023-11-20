package com.tap.rest.business;

import com.tap.db.entity.PeriodType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.LocalDateTime;

@ApplicationScoped
public class BManualPeriodRepository {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;


	public PeriodType getPeriodTypeByName(String name) {
		return em.createQuery("SELECT p FROM PeriodType p WHERE p.name = :name AND p.active = 1", PeriodType.class)
				.setParameter("name", name)
				.getSingleResult();
	}
}
