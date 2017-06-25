package com.tzahia.server;

import java.util.Collection;
import java.util.Collections;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

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
		cust = (CustomerFacade) request.getSession(true).getAttribute("facade");
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
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Coupon> getAllpurchased() {
		try {
			return getFacade().getAllPurchasedCoupon();
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return Collections.emptySet();
	}
	
	@GET
	@Path("getAllpurchasedByType")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Coupon> getAllpurchasedByType(@QueryParam("couponType") String couponType) {
		try {
			return getFacade().getAllPurchasedCouponByType(CouponType.valueOf(couponType));
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return Collections.emptySet();
	}
	
	@GET
	@Path("getAllpurchasedByType")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Coupon> getAllpurchasedByPrice(@QueryParam("price") double price) {
		try {
			return getFacade().getAllPurchasedCouponByPrice(price);
		} catch (DbdaoException e) {
			e.printStackTrace();
		} 

		return Collections.emptySet();
	}
	
//	/**
//	 * Get the name of the logged in customer
//	 * @return String The name of the logged in Customer
//	 */
//	@GET
//	@Path("getCustName")
//	@Produces(MediaType.TEXT_PLAIN)
//	public String getCustName() {
//		// getting the session, the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		Customer customer = customerFacade.getLoginCustomer();
//		session.setAttribute("customer", customer);
//		
//		return customer.getCustName();
//	}
//	
//	// GET the logged in CUSTOMER
//	/**
//	 * Get the logged in customer
//	 * @param other False - get customer with its purchased coupons only. True - get also the Not-Purchased Coupons collection (for buying)  
//	 * @return Company The logged in Customer
//	 */
//	@GET
//	@Path("getCustomer")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Customer getLoginCustomer(@QueryParam("other") boolean other){
//		// getting the session, the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		Customer customer = customerFacade.getLoginCustomer();
//		session.setAttribute("customer", customer);
//		
//		try	{
//			
//			// getting the full information of the logged in Customer (including the Coupons Collections) from the DateBase
//			customer = customerFacade.getCustomer(customer);
//			
//			// only if true - update the Not-Purchased fields in the Customer Model
//			if (other){
//				
//				customerFacade.updateNotPurchasedCouponsData(customer);
//				
//				System.out.println("SERVICE: getCustomer: Not Purchased coupons =  " + customer.getNotPurchasedCoupons());
//				System.out.println("SERVICE: getCustomer: Not Purchased Type =  " + customer.getNotPurchasedCouponTypes());
//				System.out.println("SERVICE: getCustomer: MinPrice NPC =  " + customer.getMinPriceNPC());
//				System.out.println("SERVICE: getCustomer: Max Price NPC =  " + customer.getMaxPriceNPC());
//			}
//			// updating the Customer Object in the Session
//			session.setAttribute("customer", customer);
//			System.out.println("finish getCustomer SERVICE");
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CustomerService: FAILED GET CUSTOMER from the DB: " + e.getMessage());
//		}
//		
//		return customer;
//	}
//	
//	// EXIT the Customer Page - killing the SESSION and start again from the LOGIN page
//	/**
//	 * LOG OUT of the system - killing the session
//	 * @return A "goodbye" message
//	 */
//	@GET
//	@Path("exit")
//	@Produces(MediaType.TEXT_PLAIN)
//	public String exit() {
//	
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		Customer customer = customerFacade.getLoginCustomer();
//		session.setAttribute("customer", customer);
//		
//		session.invalidate();										// killing the session
//		System.out.println("killing the session...");
//		
//		return "Bye Bye " + customer.getCustName();
//	}
//	
//	//**********************************************************************************************************************************************************
//	//									NOT IN USE Functions (was written in the 1st phase, before writing the Angular Controller)
//	//**********************************************************************************************************************************************************
//	/*
//	------------------------------------
//	get COUPON'S DATA from the DB table
//	------------------------------------
//	*/
//	// GET Coupon BY ID
//	@GET
//	@Path("getCustCoupon")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Coupon getCoupon(@QueryParam("coupId") long id) {
//		
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		
//		Coupon coupon = null;
//		
//		try	{
//			
//			coupon = customerFacade.getCoupon(id);
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CustomerService: FAILED GET COUPON BY ID: " + e.getMessage());
//		}
//		System.out.println("getCustCoupon: coupon = " + coupon);
//		return coupon;
//	}
//	
//	// SHOW a LIST of All the Coupon's TYPES from the DB
//	@GET
//	@Path("getCouponTypes")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Collection<CouponType> getCouponTypes(){
//		
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		
//		// get the List of all the Coupons that belong to the logged in customer from the Table in the DataBase
//		Collection<CouponType> types = null;
//		
//		try	{
//			
//			types = customerFacade.getCouponTypes();
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CustomerService: FAILED GET COUPON TYPES from the DataBase: " + e.getMessage());
//		}
//		
//		System.out.println("getCouponTypes:");
//		System.out.println(types);
//		return types; 
//	}
//	/*
//	----------------------------------------------------
//	show CUSTOMER'S PURCHASED COUPONS from the DB table
//	----------------------------------------------------
//	*/
//	// SHOW All Purchased coupons of the logged in customer BY TYPE
//	@GET
//	@Path("getCustCouponsByType")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Collection<Coupon> getAllPurchasedCouponsByType(@QueryParam("type") String couponType){
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		Customer customer = customerFacade.getLoginCustomer();
//		session.setAttribute("customer", customer);
//		
//		// get the List of all the Purchased Coupons of to the logged in customer from the Table in the DataBase
//		Collection<Coupon> coupons = null;
//		
//		try	{
//			
//			CouponType type = CouponType.valueOf(couponType);		// convert String to ENUM
//			coupons = customerFacade.getAllPurchasedCouponsByType(customer,type);
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CustomerService: FAILED GET COUPONS BY TYPE of " + customer.getCustName() + " CUSTOMER: " + e.getMessage());
//		}
//		
//		System.out.println("getCustCouponsByType:");
//		System.out.println(coupons);
//		return coupons; 
//	}
//	
//	// SHOW All Purchased coupons of the logged in customer BY MAXIMUM PRICE
//	@GET
//	@Path("getCustCouponsByPrice")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Collection<Coupon> getAllPurchasedCouponsByPrice(@QueryParam("minPrice") double minPrice,
//															@QueryParam("maxPrice") double maxPrice){
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		Customer customer = customerFacade.getLoginCustomer();
//		session.setAttribute("customer", customer);
//		
//		// get the List of all the Coupons from the Table in the DataBase
//		Collection<Coupon> coupons = null;
//		
//		try	{
//			
//			coupons = customerFacade.getAllPurchasedCouponsByPrice(customer,minPrice,maxPrice);
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CompanyService: FAILED GET COUPONS BY PRICE of " + customer.getCustName() + " CUSTOMER: " + e.getMessage());
//		}
//		
//		System.out.println("getCustCouponsByPrice:");
//		System.out.println(coupons);
//		return coupons; 
//	}
//	/*
//	-----------------------------------
//	show ALL COUPONS from the DB table
//	-----------------------------------
//	*/
//	// SHOW All Coupons 
//	@GET
//	@Path("getAllCoupons")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Collection<Coupon> getAllCoupons(){
//		
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		
//		// get the List of all the Coupons that belong to the logged in customer from the Table in the DataBase
//		Collection<Coupon> coupons = null;
//		
//		try	{
//			
//			coupons = customerFacade.getAllCoupons();
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CustomerService: FAILED GET ALL COUPONS: " + e.getMessage());
//		}
//		
//		System.out.println("getAllCoupons:");
//		System.out.println(coupons);
//		return coupons; 
//	}
//	
//	// SHOW All coupons BY TYPE
//	@GET
//	@Path("getCouponsByType")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Collection<Coupon> getAllCouponsByType(@QueryParam("type") String couponType){
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		
//		// get the List of all the Purchased Coupons of to the logged in customer from the Table in the DataBase
//		Collection<Coupon> coupons = null;
//		
//		try	{
//			
//			CouponType type = CouponType.valueOf(couponType);		// convert String to ENUM
//			coupons = customerFacade.getAllCouponsByType(type);
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CustomerService: FAILED GET COUPONS BY TYPE: " + e.getMessage());
//		}
//		
//		System.out.println("getCouponsByType:");
//		System.out.println(coupons);
//		return coupons; 
//	}
//	
//	// SHOW All coupons BY MAXIMUM PRICE
//	@GET
//	@Path("getCouponsByPrice")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Collection<Coupon> getAllCouponsByPrice(@QueryParam("maxPrice") double maxPrice){
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		
//		// get the List of all the Coupons from the Table in the DataBase
//		Collection<Coupon> coupons = null;
//		
//		try	{
//			
//			coupons = customerFacade.getAllCouponsByPrice(maxPrice);
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CompanyService: FAILED GET COUPONS BY PRICE: " + e.getMessage());
//		}
//		
//		System.out.println("getCouponsByPrice:");
//		System.out.println(coupons);
//		return coupons; 
//	}
//	
//	// SHOW All coupons BY MAXIMUM DATE
//	@GET
//	@Path("getCouponsByDate")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Collection<Coupon> getAllCouponsByDate(@QueryParam("maxDate") String maxDate){
//		// getting the session and the logged in facade object and the logged in customer
//		HttpSession session = request.getSession(false);									
//		CustomerFacade customerFacade = (CustomerFacade)session.getAttribute("facade");
//		
//		// get the List of all the Coupons from the Table in the DataBase
//		Collection<Coupon> coupons = null;
//		
//		try	{
//			
//			coupons = customerFacade.getAllCouponsByDate(maxDate);
//		}
//		
//		catch (MyException e){
//			
//			System.err.println("CompanyService: FAILED GET COUPONS BY DATE: " + e.getMessage());
//		}
//		
//		System.out.println("getCouponsByDate:");
//		System.out.println(coupons);
//		return coupons; 
//	}
}
