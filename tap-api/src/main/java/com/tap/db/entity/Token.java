/**
 * Generated JPA entity class for "Token"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="token", catalog="tap" )
public class Token implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private long id;

    @Column(name="jti", length=64)
	private String jti;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="token_status_id", referencedColumnName="id")
	private TokenStatus tokenstatus ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", referencedColumnName="id")
	private User user ; 

	public Token() {
		super();
	}
	
	public void setId( long id ) {
		this.id = id ;
	}

	public long getId() {
		return this.id;
	}

	public void setJti( String jti ) {
		this.jti = jti ;
	}

	public String getJti() {
		return this.jti;
	}

	public TokenStatus getTokenstatus() {
		return this.tokenstatus;
	}
	
	public void setTokenstatus(TokenStatus tokenstatus) {
		this.tokenstatus = tokenstatus;
	}
	public User getUser() {
		return this.user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
}