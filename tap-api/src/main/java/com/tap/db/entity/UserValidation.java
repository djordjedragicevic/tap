/**
 * Generated JPA entity class for "UserValidation"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="user_validation", catalog="tap" )
public class UserValidation implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="code", nullable=false, length=8)
	private String code;

    @Column(name="create_time", nullable=false)
	private LocalDateTime createTime;

    @Column(name="expire_time")
	private LocalDateTime expireTime;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", referencedColumnName="id")
	private User user ; 

	public UserValidation() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setCode( String code ) {
		this.code = code ;
	}

	public String getCode() {
		return this.code;
	}

	public void setCreateTime( LocalDateTime createTime ) {
		this.createTime = createTime ;
	}

	public LocalDateTime getCreateTime() {
		return this.createTime;
	}

	public void setExpireTime( LocalDateTime expireTime ) {
		this.expireTime = expireTime ;
	}

	public LocalDateTime getExpireTime() {
		return this.expireTime;
	}

	public User getUser() {
		return this.user;
	}
	
	public void setUser(User user) {
		this.user = user;
	}
}