package com.tap.db.dao;

import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
@RequestScoped
public class AppointmentsDAO {

	@PersistenceContext(unitName = "tap-pu")
	private EntityManager em;


}
