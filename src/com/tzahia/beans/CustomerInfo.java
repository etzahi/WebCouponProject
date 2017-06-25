package com.tzahia.beans;

import java.util.Collection;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CustomerInfo {
	
	private long id;
	private String custName;
	private Collection<Coupon> coupons;
	
	public CustomerInfo(Customer c){
		this.id = c.getId();
		this.custName = c.getCustName();
		this.coupons = c.getCoupons();
	}
	
	public long getId() {
		return id;
	}

	public String getCustName() {
		return custName;
	}

	public Collection<Coupon> getCoupons() {
		return coupons;
	}

	public void setId(long id) {
		this.id = id;
	}

	public void setCustName(String custName) {
		this.custName = custName;
	}

	public void setCoupons(Collection<Coupon> coupons) {
		this.coupons = coupons;
	}

	@Override
	public String toString() {
		return "Customer [id=" + id + ", custName=" + custName + ", coupons=" + coupons + "]";
	}
}
