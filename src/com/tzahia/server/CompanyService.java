package com.tzahia.server;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;
import com.tzahia.beans.Coupon;
import com.tzahia.dao.CouponType;
import com.tzahia.exceptions.DbdaoException;
import com.tzahia.facade.CompanyFacade;

@Path("company")
public class CompanyService {

	@Context    
	private HttpServletRequest request;

	private CompanyFacade getFacade() {
		CompanyFacade comp = null;
		comp = (CompanyFacade) request.getSession(true).getAttribute("facade");
		return comp;
	}
	
	@POST
	@Path("createCoupon")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_JSON)
	public String createCoupon(Coupon coupon) { 
		try {
			getFacade().createCoupon(coupon);
			return "Coupon Successfully created";
		} catch (DbdaoException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "Failed to create coupon";
	}
	
	@GET
	@Path("removeCoupon")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_JSON)
	public String removeCoupon(@QueryParam("couponId") long couponId) { 
		try {			
			getFacade().removeCoupon(couponId);
			return "Coupon Successfully created";
		} catch (DbdaoException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "Failed to create coupon";
	}
	
	@GET
	@Path("updateCoupon")
	@Produces(MediaType.TEXT_PLAIN)
	public String updateCoupon(@QueryParam("couponId") long couponId,
			@QueryParam("endDate") String endDate,
			@QueryParam("price") double price) { 
		try {			
			Date formatedDate = new SimpleDateFormat("yyyy-MM-dd").parse(endDate);
			getFacade().updateCoupon(couponId, formatedDate, price);
			return "Coupon Successfully created";
		} catch (DbdaoException | ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return "Failed to create coupon";
	}
	
	@GET
	@Path("getCoupon")
	@Produces(MediaType.TEXT_PLAIN)
	public String getCoupon(@QueryParam("couponId") long couponId) {
		try {
			CompanyFacade facade = getFacade(); 
			Coupon c = facade.getCoupon(couponId);
			Gson g = new Gson();
			return g.toJson(c);
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return null;
	}
	
	@GET
	@Path("getAllCoupon")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Coupon> getAllCoupon() {
		try {
			return getFacade().getAllCoupons();
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return Collections.emptySet();
	}
	

	@GET
	@Path("getAllCouponByType")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Coupon> getAllCouponByType(@QueryParam("couponType") String couponType) {
		try {
			return getFacade().getCouponByType(CouponType.valueOf(couponType));
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 
		return Collections.emptySet();
	}
	
}
