package com.tzahia.beans;

import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CompanyInfo {
	
	private long id;
	private String compName;
	private Collection<Coupon> coupons;
	
	public CompanyInfo(Company c) {
		this.id = c.getId();
		this.compName = c.getCompName();
		this.coupons = c.getCoupons();
	}
	
	public long getId() {
		return id;
	}

	public String getCompName() {
		return compName;
	}

	public Collection<Coupon> getCoupons() {
		return coupons;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setCompName(String compName) {
		this.compName = compName;
	}

	public void setCoupons(Collection<Coupon> coupons) {
		this.coupons = coupons;
	}

	@Override
	public String toString() {
		return "Company [id=" + id + ", compName=" + compName + ", coupons=" + coupons + "]";
	}
}
