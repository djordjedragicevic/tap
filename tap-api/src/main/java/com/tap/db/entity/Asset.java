/**
 * Generated JPA entity class for "Asset"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;

@Entity
@Table(name="asset", catalog="tap" )
public class Asset implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="entity_identifier", nullable=false)
	private long entityIdentifier;

    @Column(name="location", nullable=false, length=64)
	private String location;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="asset_type_id", referencedColumnName="id")
	private AssetType assettype ; 

	public Asset() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setEntityIdentifier( long entityIdentifier ) {
		this.entityIdentifier = entityIdentifier ;
	}

	public long getEntityIdentifier() {
		return this.entityIdentifier;
	}

	public void setLocation( String location ) {
		this.location = location ;
	}

	public String getLocation() {
		return this.location;
	}

	public AssetType getAssettype() {
		return this.assettype;
	}
	
	public void setAssettype(AssetType assettype) {
		this.assettype = assettype;
	}
}