package com.tzahia.server;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;
import com.tzahia.beans.Coupon;
import com.tzahia.dao.CouponType;
import com.tzahia.dbdao.CouponDBDAO;
import com.tzahia.exceptions.DbdaoException;
import com.tzahia.exceptions.FacadeException;
import com.tzahia.facade.CustomerFacade;

@Path("customer")
public class CustomerService {
	
	@Context    
	private HttpServletRequest request;

	private CustomerFacade getFacade() {
		CustomerFacade cust = null;
		cust = (CustomerFacade) request.getSession(false).getAttribute("facade");
		return cust;
	}
	
	@GET
	@Path("purchaseCoupon")
	@Produces(MediaType.TEXT_PLAIN)
	public String purchaseCoupon(@QueryParam("couponId") long couponId) {
		CouponDBDAO dao = new CouponDBDAO();
		Coupon coup;
		String errMsg = null;
		try {
			coup = dao.getCoupon(couponId);
			getFacade().purchaseCoupon(coup);
			return "Enjoy your coupon";
		} catch (DbdaoException e) {
			errMsg = "Failed to access the System, please try again later";
			e.printStackTrace();
		} catch (FacadeException e) {
			errMsg = e.getMessage();
			e.printStackTrace();
		}

		return errMsg;
	}
	
	@GET
	@Path("getAllpurchased")
	@Produces(MediaType.TEXT_PLAIN)
	public String getAllpurchased() {
		try {
			return new Gson().toJson(getFacade().getAllPurchasedCoupon());
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return null;
	}
	
	@GET
	@Path("getAllpurchasedByType")
	@Produces(MediaType.TEXT_PLAIN)
	public String getAllpurchasedByType(@QueryParam("couponType") String couponType) {
		try {
			return new Gson().toJson(getFacade().getAllPurchasedCouponByType(CouponType.valueOf(couponType)));
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return null;
	}
	
	@GET
	@Path("getAllpurchasedByPrices")
	@Produces(MediaType.TEXT_PLAIN)
	public String getAllpurchasedByPrice(@QueryParam("price") double price) {
		try {
			return new Gson().toJson(getFacade().getAllPurchasedCouponByPrice(price));
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return null;
	}	

}
