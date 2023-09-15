/**
 * Generated JPA entity class for "UserState"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="user_state", catalog="tap" )
public class UserState implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="favorite_providers", length=65535)
	private String favoriteProviders;

    @Column(name="language", length=8)
	private String language;

    @Column(name="theme", length=16)
	private String theme;

    @Column(name="custom", length=65535)
	private String custom;


	public UserState() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setFavoriteProviders( String favoriteProviders ) {
		this.favoriteProviders = favoriteProviders ;
	}

	public String getFavoriteProviders() {
		return this.favoriteProviders;
	}

	public void setLanguage( String language ) {
		this.language = language ;
	}

	public String getLanguage() {
		return this.language;
	}

	public void setTheme( String theme ) {
		this.theme = theme ;
	}

	public String getTheme() {
		return this.theme;
	}

	public void setCustom( String custom ) {
		this.custom = custom ;
	}

	public String getCustom() {
		return this.custom;
	}

}