/**
 * Generated JPA entity class for "Service"
 */

package com.tap.db.entity;

import java.io.Serial;
import java.io.Serializable;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name="service", catalog="tap" )
public class Service implements Serializable {
	@Serial
	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id", nullable=false)
	private int id;

    @Column(name="name", length=256)
	private String name;

    @Column(name="note", length=256)
	private String note;

    @Column(name="price", nullable=false)
	private BigDecimal price;

    @Column(name="price_to")
	private BigDecimal priceTo;

    @Column(name="duration", nullable=false)
	private short duration;

    @Column(name="duration_to")
	private Short durationTo;

    @Column(name="description", length=512)
	private String description;

    @Column(name="active", nullable=false)
	private boolean active;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="category_id", referencedColumnName="id")
	private Category category ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="group_id", referencedColumnName="id")
	private Group group ; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="provider_id", referencedColumnName="id")
	private Provider provider ; 

	public Service() {
		super();
	}
	
	public void setId( int id ) {
		this.id = id ;
	}

	public int getId() {
		return this.id;
	}

	public void setName( String name ) {
		this.name = name ;
	}

	public String getName() {
		return this.name;
	}

	public void setNote( String note ) {
		this.note = note ;
	}

	public String getNote() {
		return this.note;
	}

	public void setPrice( BigDecimal price ) {
		this.price = price ;
	}

	public BigDecimal getPrice() {
		return this.price;
	}

	public void setPriceTo( BigDecimal priceTo ) {
		this.priceTo = priceTo ;
	}

	public BigDecimal getPriceTo() {
		return this.priceTo;
	}

	public void setDuration( short duration ) {
		this.duration = duration ;
	}

	public short getDuration() {
		return this.duration;
	}

	public void setDurationTo( Short durationTo ) {
		this.durationTo = durationTo ;
	}

	public Short getDurationTo() {
		return this.durationTo;
	}

	public void setDescription( String description ) {
		this.description = description ;
	}

	public String getDescription() {
		return this.description;
	}

	public void setActive( boolean active ) {
		this.active = active ;
	}

	public boolean isActive() {
		return this.active;
	}

	public Category getCategory() {
		return this.category;
	}
	
	public void setCategory(Category category) {
		this.category = category;
	}
	public Group getGroup() {
		return this.group;
	}
	
	public void setGroup(Group group) {
		this.group = group;
	}
	public Provider getProvider() {
		return this.provider;
	}
	
	public void setProvider(Provider provider) {
		this.provider = provider;
	}
}