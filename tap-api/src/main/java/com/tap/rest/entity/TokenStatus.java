/**
 * Generated JPA entity class for "TokenStatus"
 */

package com.tap.rest.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

@Entity
@Table(name="token_status", catalog="tap" )
public class TokenStatus implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private short id;

    @Column(name="name", nullable=false, length=32)
	private String name;

    @Column(name="description", length=256)
	private String description;


    @OneToMany(mappedBy="tokenstatus")
	@JsonbTransient
	private List<Token> tokenList; 

	public TokenStatus() {
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

	public List<Token> getTokenList() {
		return this.tokenList;
	}
	
	public void setTokenList(List<Token> tokenList) {
		this.tokenList = tokenList;
	}
}