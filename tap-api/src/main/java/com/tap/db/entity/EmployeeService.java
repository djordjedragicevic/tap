package com.tap.db.entity;

import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;

@Entity
@Table(name = "employee_service")
public class EmployeeService implements Serializable {
	@Serial
	private static final long serialVersionUID = 6631915835726869537L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_service_id", nullable = false)
	private CompanyService companyService;
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	private Byte active;

}