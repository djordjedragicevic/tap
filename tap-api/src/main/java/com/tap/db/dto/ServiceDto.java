/**
 * Generated DTO class for "ServiceDto"
 */
package com.tap.db.dto;
import java.math.BigDecimal;
public class ServiceDto {	
	private Integer id;
	private String name;
	private String note;
	private BigDecimal price;
	private BigDecimal priceTo;
	private Short duration;
	private Short durationTo;
	private String description;
	private CategoryDto category; 
	private GroupDto group; 
	private ProviderDto provider; 
	public ServiceDto() {}

	public ServiceDto setId( Integer id ) {
		this.id = id;
		return this;
	}

	public Integer getId() {
		return this.id;
	}

	public ServiceDto setName( String name ) {
		this.name = name;
		return this;
	}

	public String getName() {
		return this.name;
	}

	public ServiceDto setNote( String note ) {
		this.note = note;
		return this;
	}

	public String getNote() {
		return this.note;
	}

	public ServiceDto setPrice( BigDecimal price ) {
		this.price = price;
		return this;
	}

	public BigDecimal getPrice() {
		return this.price;
	}

	public ServiceDto setPriceTo( BigDecimal priceTo ) {
		this.priceTo = priceTo;
		return this;
	}

	public BigDecimal getPriceTo() {
		return this.priceTo;
	}

	public ServiceDto setDuration( short duration ) {
		this.duration = duration;
		return this;
	}

	public short getDuration() {
		return this.duration;
	}

	public ServiceDto setDurationTo( Short durationTo ) {
		this.durationTo = durationTo;
		return this;
	}

	public Short getDurationTo() {
		return this.durationTo;
	}

	public ServiceDto setDescription( String description ) {
		this.description = description;
		return this;
	}

	public String getDescription() {
		return this.description;
	}

	public CategoryDto getCategory() {
		return this.category;
	}

	public ServiceDto setCategory(CategoryDto category) {
		this.category = category;
		return this;
	}
	public GroupDto getGroup() {
		return this.group;
	}

	public ServiceDto setGroup(GroupDto group) {
		this.group = group;
		return this;
	}
	public ProviderDto getProvider() {
		return this.provider;
	}

	public ServiceDto setProvider(ProviderDto provider) {
		this.provider = provider;
		return this;
	}
}