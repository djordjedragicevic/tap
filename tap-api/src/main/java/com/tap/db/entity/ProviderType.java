/**
 * Generated JPA entity class for "ProviderType"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

@Entity
@Table(name="provider_type", catalog="tap" )
public class ProviderType implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private short id;

    @Column(name="name", nullable=false, length=64)
	private String name;

    @Column(name="description", length=512)
	private String description;

    @Column(name="active", nullable=false)
	private boolean active;


    @OneToMany(mappedBy="providertype")
	@JsonbTransient
	private List<Provider> providerList; 

	public ProviderType() {
		super();
	}
	
	public void setId( short id ) {
		this.id = id;
	}

	public short getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name;
	}

	public String getName() {
		return this.name;
	}

	public void setDescription( String description ) {
		this.description = description;
	}

	public String getDescription() {
		return this.description;
	}

	public void setActive( boolean active ) {
		this.active = active;
	}

	public boolean isActive() {
		return this.active;
	}

	public List<Provider> getProviderList() {
		return this.providerList;
	}
	
	public void setProviderList(List<Provider> providerList) {
		this.providerList = providerList;
	}
}