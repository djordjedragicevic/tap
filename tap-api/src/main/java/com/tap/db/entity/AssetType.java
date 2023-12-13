/**
 * Generated JPA entity class for "AssetType"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import jakarta.json.bind.annotation.JsonbTransient;
import java.util.List;

@Entity
@Table(name="asset_type", catalog="tap" )
public class AssetType implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private short id;

    @Column(name="name", nullable=false, length=16)
	private String name;


    @OneToMany(mappedBy="assettype")
	@JsonbTransient
	private List<Asset> assetList; 

	public AssetType() {
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

	public List<Asset> getAssetList() {
		return this.assetList;
	}
	
	public void setAssetList(List<Asset> assetList) {
		this.assetList = assetList;
	}
}