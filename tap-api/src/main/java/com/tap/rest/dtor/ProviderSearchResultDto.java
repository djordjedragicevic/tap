package com.tap.rest.dtor;

public class ProviderSearchResultDto {
	private final Integer id;
	private final String name;
	private final String searchName;
	private final String mainImg;
	private final Byte legalEntity;

	private final String providerType;
	private final String providerTypeImage;

	private final String address1;

	private final Double mark;

	private final Long reviewCount;

	private ServiceSearchResultDto serviceResult;

	public ProviderSearchResultDto(
			Integer id, String name, String searchName, String mainImg, Byte legalEntity,
			String providerType, String providerTypeImage,
			String address1,
			Double mark, Long reviewCount) {

		this.id = id;
		this.name = name;
		this.searchName = searchName;
		this.mainImg = mainImg;
		this.legalEntity = legalEntity;
		this.providerType = providerType;
		this.providerTypeImage = providerTypeImage;
		this.address1 = address1;
		this.mark = mark;
		this.reviewCount = reviewCount;
	}

	public Integer getId() {
		return id;
	}

	public String getName() {
		return name;
	}
	public String getSearchName() {
		return searchName;
	}

	public String getMainImg() {
		return mainImg;
	}

	public Byte getLegalEntity() {
		return legalEntity;
	}

	public String getProviderType() {
		return providerType;
	}

	public String getProviderTypeImage() {
		return providerTypeImage;
	}

	public String getAddress1() {
		return address1;
	}

	public Double getMark() {
		return mark;
	}

	public Long getReviewCount() {
		return reviewCount;
	}

	public ServiceSearchResultDto getServiceResult() {
		return serviceResult;
	}

	public void setServiceResult(ServiceSearchResultDto serviceResult) {
		this.serviceResult = serviceResult;
	}
}
