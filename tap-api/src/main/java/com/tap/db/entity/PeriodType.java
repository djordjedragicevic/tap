/**
 * Generated JPA entity class for "PeriodType"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

@Entity
@Table(name="period_type", catalog="tap" )
public class PeriodType implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", nullable=false, length=32)
	private String name;

    @Column(name="active", nullable=false)
	private boolean active;

    @Column(name="open", nullable=false)
	private boolean open;

    @Column(name="description", length=512)
	private String description;


    @OneToMany(mappedBy="periodtype")
	@JsonbTransient
	private List<CustomPeriod> customperiodList; 

    @OneToMany(mappedBy="periodtype")
	@JsonbTransient
	private List<WorkInfo> workinfoList; 

	public PeriodType() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id;
	}

	public int getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setActive( boolean active ) {
		this.active = active;
	}

	public boolean isActive() {
		return this.active;
	}

	public void setOpen( boolean open ) {
		this.open = open;
	}

	public boolean isOpen() {
		return this.open;
	}

	public void setDescription( String description ) {
		this.description = description;
	}

	public String getDescription() {
		return this.description;
	}

	public List<CustomPeriod> getCustomperiodList() {
		return this.customperiodList;
	}
	
	public void setCustomperiodList(List<CustomPeriod> customperiodList) {
		this.customperiodList = customperiodList;
	}
	public List<WorkInfo> getWorkinfoList() {
		return this.workinfoList;
	}
	
	public void setWorkinfoList(List<WorkInfo> workinfoList) {
		this.workinfoList = workinfoList;
	}
}