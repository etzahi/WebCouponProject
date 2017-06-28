/**
 * 	Company Page Controller	
 */
//angular.module('couponSystem', ['ngMaterial']);
var app = angular.module('couponSystem', []);
	
	app.controller('adminCtrl', function($scope, $http, $window, $timeout) {
	
	//*******************************************************************************************************************************************//
	//														I N I T     A C T I O N S			 		  		 								 //
	//*******************************************************************************************************************************************//
	/*
	 *********************************
	 *     INITIALIZE NG-SHOWS 		 * 
	 *********************************
	 */
	//-------------------------------------
	// initialize the Main Menu to be true
	//-------------------------------------	
	$scope.showWelcomeMessage=true;
	$scope.showMainMenu=true;
	
	//-----------------------------------------------
	// initialize all other show-windows to be false
	//-----------------------------------------------
	$scope.showExitMessage=false;
	$scope.showSQLErrorMessage=false;
	$scope.showCantFindErrorMessage=false;
	$scope.showHeaderMenu=false;
	
	//---------------------
	// COMPANY show-windows
	//---------------------
	$scope.showCompanies=false;
	$scope.showCompMenu=false;
	$scope.showCompListMenu=false;
	$scope.showAllCompanies=false;
	$scope.oneCompany = false;											// ng-hide: open the Sort Arrows in the table's titles
	$scope.showCompaniesTable=false;
	$scope.showCompanyNameList=false;
	$scope.showCompanyByName=false;
	$scope.showAllCompCoupons = false;
	$scope.oneCompCupon = false;										// ng-hide: open the Sort Arrows in the table's titles
	// EDIT COMPANIES show-windows 
	$scope.showEditCompany = false;
	$scope.showAddCompanyForm = false;
	$scope.showUpdateCompForm = false;
	// ERROR MESSAGES Company show-windows 
	$scope.showNoCompaniesErrorMessage=false;
	$scope.showNoCompanyCouponsErrorMessage=false;
	$scope.showAllCompaniesErrorMessage=false;
	$scope.showCompanyByNameErrorMessage=false;
	// CONFIRM MESSAGE Company show-window
	$scope.showAddCompanyConfirmMessage=false;
	$scope.showRemoveCompanyConfirmMessage=false;
	$scope.showUpdateCompanyConfirmMessage=false;
	
	//-----------------------
	// CUSTOMER show-windows
	//-----------------------
	$scope.showCustomers=false;
	$scope.showCustMenu=false;
	$scope.showCustListMenu=false;
	$scope.showAllCustomers=false;
	$scope.oneCustomer = false;											// ng-hide: open the Sort Arrows in the table's titles
	$scope.showCustomersTable=false;
	$scope.showCustomerNameList=false;
	$scope.showCustomeryByName=false;
	$scope.showAllCustCoupons = false;
	$scope.oneCustCupon = false;										// ng-hide: open the Sort Arrows in the table's titles
	// EDIT COMPANIES show-windows 
	$scope.showEditCustomer = false;
	$scope.showAddCustomerForm = false;
	$scope.showUpdateCustForm = false;
	// ERROR MESSAGES Company show-windows 
	$scope.showNoCustomersErrorMessage=false;
	$scope.showNoCustomerCouponsErrorMessage=false;
	$scope.showAllCustomersErrorMessage=false;
	$scope.showCustomerByTitleErrorMessage=false;
	// CONFIRM MESSAGE Company show-window
	$scope.showAddCustomerConfirmMessage=false;
	$scope.showRemoveCustomerConfirmMessage=false;
	$scope.showUpdateCustomerConfirmMessage=false;
	
	/*
	 *************************************************
	 *     INITIALIZE and DEFINE $SCOPE VARIABLES 	 * 
	 *************************************************
	 */
	//---------------------------------------
	// initialize Confirm and Error MESSAGES
	//---------------------------------------
	$scope.sqlErrorMessage = "An ERROR occured while trying to get data from the DataBase";
	$scope.cantFindErrorMessage = "Can't find!";
	$scope.noCompaniesErrorMessage = "Sorry, no company has subscribed yet";
	$scope.noCustomersErrorMessage = "Sorry, no customer has subscribed yet";
	$scope.noCompanyCouponsErrorMessage = "Sorry, this company doesn't have any coupons yet";
	$scope.noCustomerCouponsErrorMessage = "Sorry, this customer doesn't have any coupons yet";
	
	//-------------------------------------
	// define Objects and Arrays VARIABLES
	//-------------------------------------
	$scope.companies = null;										
	$scope.customers = null;										
	$scope.newCompany = null;
	$scope.newCustomer = null;
	$scope.webCompany = null;
	$scope.webCustomer = null;
	$scope.compCoupons = null;										
	$scope.custCoupons = null;										
	
	//------------------------
	// define Table VARIABLES
	//------------------------
	$scope.sortType = 'name'; 											// set the default sort type
	$scope.couponSortType = 'id'; 										// set the default sort type in the coupons table
	$scope.sortReverse  = false;  										// set the default sort order
	
	//*******************************************************************************************************************************************//
	//														E V E V T S     F U N C T I O N S			 		  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 *******************************
	 *  GET OBJECTS FROM DATABASE  * 
	 *******************************
	 *
	 *-----------
	 * GET ADMIN 
	 *-----------
	 */ 
	// get the list of all the subscribed companies/customers from the DB 
	var getAdmin = function(listType){
		
		$http.get("rest/admin/getAdmin?listType=" + listType).success(function(response) { $scope.admin = response;});
		
	};
	
	/*
	 *------------------------------------------
	 *  CONVERT ADMIN'S COLLECTIONS TO AN ARRAY 
	 *------------------------------------------
	 */ 
	// convert the collections in the Admin Model to an Array 
	var getAdminArray = function(listType){
		
		var list = null;
		
		if ($scope.admin != null){
			
			switch (listType){
			
				case "COMPANY":
					
					list = $scope.admin.companies;
					
					if (list != null){									// check if there is any subscribed company
						
						$scope.companies = setList(list);				// force the companies list to be an array and without NULL fields
						list = $scope.companies;
					}
					break;
					
				case "CUSTOMER":
					
					list = $scope.admin.customers;
					
					if (list != null){									// check if there is any subscribed customer
						
						$scope.customers = setList(list);				// force the customers list to be an array and without NULL fields
						list = $scope.customers;
					}
					break;	
					
				default: 												// return null
					
					console.log("worng parameter: must be 'COMPANY' or 'CUSTOMER' only!");
			}
		}
		
		return list;
		
	};
	
	/*
	*------------------------
	*  GET COMPANY'S COUPONS
	*------------------------
	*/ 
	// get the company's coupons from the DB 
	var getCompanyCoupons = function(id){
		
		$http.get("rest/admin/getWebCompany?compId=" + id).success(function(response) { $scope.webCompany = response;});
		
		// do this block only after 100 milliseconds (wait for the response of the $http request)
		$timeout (function(){
			
			var coupons = $scope.webCompany.coupons;					// get the update Company's Coupons from the database
			
			if (coupons != null){										// check if the company has any coupons
				
				$scope.compCoupons = setCouponList(coupons)				// force the coupons list to be an array and without NULL fields
			}
			
		}, 100);		
	};
	
	/*
	 *-------------------------
	 *  GET CUSTOMER'S COUPONS
	 *-------------------------
	 */ 
	// get the customer's coupons from the DB 
	var getCustomerCoupons = function(id){
		
		$http.get("rest/admin/getWebCustomer?custId=" + id).success(function(response) { $scope.webCustomer = response;});
		
		// do this block only after 100 milliseconds (wait for the response of the $http request)
		$timeout (function(){
			
			var coupons = $scope.webCustomer.coupons;					// get the update Customer's Coupons from the database
			
			if (coupons != null){										// check if the customer has any coupons
				
				$scope.custCoupons = setCouponList(coupons)				// force the coupons list to be an array and without NULL fields
			}
			
		}, 100);		
	};
	
	//*******************************************************************************************************************************************//
	//										Button 1 :		C O M P A N I E S      W I N D O W 			 		  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 ***************************
	 * 	 COMPANY SHOW WINDOW   *
	 ***************************
	 *
	 *-----------------------------
	 * OPEN SHOW COMPANIES'S  MENU
	 *-----------------------------
	 */ 
	// open the "Show Companies" page and the Companies Menu
	$scope.openCompanies = function(){		
		alert("This is the companies!");		
	};
	
	/*
	 *-----------------------------------
	 *  OPEN SHOW COMPANIES VIEW OPTIONS
	 *-----------------------------------
	 */ 
	// open the page of the "Show Companies" button
	$scope.getCompanies=function(){
		
		// get the Admin model with the update collections of all companies from the database
		getAdmin("COMPANY");
		
		$timeout (function(){
			
			$scope.showSQLErrorMessage=false;							// close the SQL ERROR window
			$scope.showCompMenu=false;									// close the Company Menu window
			$scope.showEditCompany=false;								// close the EDIT Companies Window
			$scope.showAllCompCoupons = false;							// close the show company's Coupons Window
			$scope.showNoCompanyCouponsErrorMessage = false;			// close the No Coupons ERROR window
			
			$scope.showCompaniesOptions=true;							// open the Show Companies Window
			
			// check if there is any subscribed companies
			if (getAdminArray("COMPANY") != null){						// force the companies list to be an array even if there is only one company
				
				$scope.showCompListMenu=true;							// open the Company Main Menu window
				$scope.showNoCompaniesErrorMessage=false;				// close the ERROR window
				
			}
			// NO COMPANIES
			else {														
				
				$scope.showNoCompaniesErrorMessage=true;				// open the ERROR window
				$scope.showCompListMenu=false;							// close the Company Coupons Main Menu window
			}
			
		}, 100);
	};
	
	/*
	 *--------------------
	 * SHOW ALL COMPANIES
	 *--------------------
	 */ 
	// SHOW ALL the Subscribed Companies
	$scope.showAllCompanies=function(){
		
		if($scope.showCompaniesTable==false){
			
			// get the Admin model with the update collections of all companies from the database
			getAdmin("COMPANY");
				
			$timeout (function(){
				
				// check if there is any subscribed companies
				if (getAdminArray("COMPANY") != null){						// force the companies list to be an array even if there is only one company
					
					if ($scope.companies.length == 1){ 						// if there is only one company in the list - we don't need the Sort Arrow
						
						$scope.oneCompany = true;							// hide the Sort Arrow from the table's titles
						
					}else	$scope.oneCompany = false;						// open the Sort Arrow in the table's titles
					
					$scope.showCompaniesTable=true;							// open the SHOW ALL Companies window (the companies table)
					$scope.showAllCompaniesErrorMessage=false;				// close the ERROR window
					
				}
				// NO COMPANIES
				else	$scope.showAllCompaniesErrorMessage=true;			// open the ERROR window
				
			}, 100);
		}
		
		else 	$scope.showCompaniesTable=false;							// close the SHOW ALL Companies window
	};
	
	/*
	 *----------------------
	 * SHOW COMPANY BY NAME
	 *----------------------
	 */ 
	// SHOW the NAME's LIST of all the companies
	$scope.getCompaniesNameList=function(){
		
		if($scope.showCompanyNameList==false){
			
			// get the Admin model with the update collections of all companies from the database
			getAdmin("COMPANY");
			
			$timeout (function(){
				
				// check if there is any subscribed companies
				if (getAdminArray("COMPANY") != null){						// force the companies list to be an array even if there is only one company
					
					$scope.showCompanyByNameErrorMessage=false;				// close the ERROR window
					
					if ($scope.companies.length == 1){ 						// if there is only one company in the list - don't open the NAME list
						
						var company = $scope.admin.companies;
						$scope.selectedCompName = company.compName;
						$scope.getCompanyByName();							// get the company by NAME 
					}
					
					else	$scope.showCompanyNameList=true;				// open the All Companies's NAME list window	
				
				}
				// NO COMPANIES
				else	$scope.showCompanyByNameErrorMessage=true;			// open the ERROR window
				
			}, 100);
		}
		
		else {
			
			$scope.showCompanyNameList=false;								// close the All Companies's NAME list window	
			$scope.showCompanyByName=false;									// close the table of the Company of the selected NAME 
		}
	};
	/*
	 *---------------------
	 * GET COMPANY BY NAME
	 *---------------------
	 */
	// GET a Company by its NAME
	$scope.getCompanyByName=function(){	
		
		$scope.company = getObjectByName($scope.companies,$scope.selectedCompName, "COMPANY");
		
		if ($scope.company != null)	$scope.showCompanyByName=true;			// show the table of the Company of the selected NAME
		
		else		      $scope.showCantFoundErrorMessage=true;			// open the ERROR window
	};
	
	/*
	 *---------------------
	 * GET COMPANY BY ID
	 *---------------------
	 */ 
	// GET a Company by its ID
	$scope.getCompanyById=function(){	
		
		$scope.company = getObjectById($scope.companies,$scope.selectedCompId);
		
		if ($scope.company != null)	$scope.showCompanyById=true;			// show the table of the Company of the selected ID
			
		else		      $scope.showCantFoundErrorMessage=true;			// open the ERROR window
	};
	
	/*
	 *-----------------------------
	 * SHOW COMPANY'S COUPONS LIST
	 *-----------------------------
	 */
	// SHOW ALL Company's Coupons
	$scope.showCompanyCoupons=function(id){
		
		// get the company and its coupons by the selected Id
		getCompanyCoupons(id);
		
		$timeout (function(){
			
			if ($scope.webCompany != null){
				
				$scope.showSQLErrorMessage=false;							// close the SQL ERROR window
				
				var coupons = $scope.webCompany.coupons;
				
				// check if the company has any coupons
				if (coupons != null){										
					
					$scope.showCompListMenu=false;							// close the Show Company list Menu window
					$scope.showNoCompaniesErrorMessage=false;				// close the No Companies ERROR window
					$scope.showNoCompanyCouponsErrorMessage=false;			// close the No Coupons ERROR window
					
					if ($scope.compCoupons.length == 1){ 					// if there is only one coupon in the list - we don't need the Sort Arrow
						
						$scope.oneCompCoupon = true;						// hide the Sort Arrow from the table's titles
						
					}else	$scope.oneCompCoupon = false;					// open the Sort Arrow in the table's titles
					
					$scope.showAllCompCoupons=true;							// open the SHOW ALL Company's Coupons window
					
				}
				// NO COUPONS
				else 	{
					
					$scope.showNoCompanyCouponsErrorMessage=true;			// open the No Coupons ERROR window
				}
			}
			
			else	$scope.showSQLErrorMessage=true;						// open the SQL ERROR window
			
		}, 100);
	};
	
	//*******************************************************************************************************************************************//
	/*
	 ***************************
	 * 	 COMPANY EDIT WINDOW   *
	 ***************************
	 *
	 *--------------------
	 *  ADD A NEW COMPANY   
	 *--------------------
	 */
	// open the ADD Company Form
	$scope.createCompany=function(){
		
		resetAddCompanyForm();												// reset the Add Company Form
		
		$scope.showCompMenu=false;											// close the Company Menu window
		$scope.showCompaniesOptions=false;									// close the Show Companies Window
		$scope.showUpdateCompForm=false;									// close the Update Company Form 
		$scope.showAddConfirmMessage=false;									// close the Confirm Message
		
		$scope.showEditCompany = true;										// open the Edit Company Window
		$scope.showAddCompanyForm = true;									// open the Adding a new Company Window
	};
	
	// ADD a new Company to the Companies list
	$scope.addCompany=function() {
		
        // putting the company data from the Form into a JSON format
		var formCompany = {				
				"name": $scope.compName,
				"pass": $scope.compPassword,
				"email": $scope.compEmail
		};
		
		// don't show "NULL" or "UNDEFINED" in the show coupon table in the client HTML page
		formCompany = setObjNullFields(formCompany);
		
		
		// adding the new coupon in the DataBase Tables
		$http.post("rest/admin/createCompany", formCompany).success(function(response) { 
			$scope.addCompanyConfirm = response;
		});
		
		$timeout (function(){
			
			$scope.showAddCompanyConfirmMessage=true;						// open the Confirm Message window
			
			// if the operation succeeded - reset the Form for adding another company
			if ($scope.addCompanyConfirm.startsWith("SUCCEED")){
				
				$timeout (function(){
					
					getAdmin("COMPANY");
					
					$timeout (function(){
						
						// check if there is any subscribed companies
						if (getAdminArray("COMPANY") == null){				// force the companies list to be an array even if there is only one company
							
							$scope.addCompanyConfirm = "Sorry, there are no companies in the list"
							$scope.showAddCompanyConfirmMessage=true;		// open the Error Message window
						}
						
					}, 100);
					
					$scope.showAddCompanyForm=false;						// close the Add company Form
					
					resetAddCompanyForm();									// reset the Add Company Form
					
					$scope.showAddCompanyConfirmMessage=false;				// close the Confirm Message after reset
					$scope.showAddCompanyForm=true;							// open the Add company Form after reset
					
				}, 2500);	
			}
		
		}, 100);
		
	};
	
	/*
	 * ----------------------
	 * REMOVE COMPANY BUTTON
	 * ----------------------
	 */
	// REMOVE the Company (By its ID)
	$scope.removeCompany=function(id){	
		
		$scope.showRemoveCompanyConfirmMessage=false;						// close the Confirm Message
		
		var confirmRemove = confirm("are you sure you want to remove company " + id + "?");
		
		if (confirmRemove){
			
			$http.get("rest/admin/removeCompany?compId=" + id).success(function(response) { $scope.removeCompanyMessage = response;});
			
			$timeout (function(){
				
			$scope.showRemoveCompanyConfirmMessage=true;					// open the Confirm Message
			
				$timeout (function(){
					
						$scope.refreshCompany();							// refreshing and updating the "show companies" window after execute a delete action
						$scope.showRemoveCompanyConfirmMessage=false;		// close the Confirm Message
						
				}, 1500);
				
			}, 100);	
		}
	}
	
	/*
	 * ----------------------
	 * UPDATE COMPANY BUTTON
	 * ----------------------
	 */
	// open the UPDATE Form
	$scope.openUpdateCompForm=function(id){
		
		$scope.showUpdateCompanyConfirmMessage=false;						// close the Confirm Message
		
		var confirmUpdate = confirm("are you sure you want to update company " + id + "?");
		
		if (confirmUpdate){
			
			// get the company by the selected Id
			$scope.newCompany = getObjectById($scope.companies,id);
			
			resetUpdateCompanyForm();										// reset the Update Company Form
			
			$scope.showCompaniesOptions=false;								// close the "show companies" window
			$scope.showAddCompanyForm=false;								// close the Add company Form
			$scope.showAllCompCoupons=false;								// close the "Show company's coupons" window
			
			$scope.showEditCompany=true;									// open the "Edit Company" window
			$scope.showUpdateCompForm=true;									// open the Update Company Form
		}
	}
	// UPDATE the Company (By its ID)
	$scope.updateCompany=function(){	
		
		var confirmUpdate = confirm("are you sure you want to update company " + $scope.newCompany.compName + "?");
		
		// keep the previous values if the field hasn't been changed
		if ($scope.newCompPassword == "")		$scope.newCompPassword = $scope.newCompany.password;
		if ($scope.newCompEmail == "")			$scope.newCompEmail	= $scope.newCompany.email;
			
		if (confirmUpdate){
			
			$http.get("rest/admin/updateCompany?compId=" + $scope.newCompany.id + "&pass=" + $scope.newCompPassword + "&email=" + $scope.newCompEmail)
																							.success(function(response) { $scope.updateCompanyMessage = response;});
			$timeout (function(){
				
				$scope.showUpdateCompanyConfirmMessage=true;				// open the Confirm Message
				
			}, 100);
		}
		// return to the "show company's coupons" menu - reset the form and refresh 
		$timeout (function(){
			
			// if the operation succeeded - update the Company's coupon list in the Model
			if ($scope.updateCompanyMessage.startsWith("SUCCEED")){
				
				//updating the Company's list by getting it again from the DB
				getAdmin("COMPANY");
				
				$timeout (function(){
					
					$scope.companies = getAdminArray("COMPANY");			// force the companies list to be an array even if there is only one company
				
				}, 100);
				
				resetUpdateCompanyForm();									// reset the Update Coupon Form
				
				$scope.refreshCompany();									// refreshing and updating the "show coupon" window after execute an update action	
			}
			
		}, 2500);
	}

	//*******************************************************************************************************************************************//
	//										Button 2 :		C U S T O M E R S      W I N D O W 			 		  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 ****************************
	 * 	 CUSTOMER SHOW WINDOW	*
	 ****************************
	 *
	 *-----------------------------
	 * OPEN SHOW CUSTOMERS'S MENU
	 *-----------------------------
	 */ 
	// open the "Show Customers" page and the Customers Menu
	$scope.openCustomers = function(){
		
		// get the Admin model with the update collections of all customers from the database
		getAdmin("CUSTOMER");
		
		$timeout (function(){
			
			$scope.showSQLErrorMessage=false;								// close the SQL ERROR window
			$scope.showMainMenu=false;										// close the Main Menu window
			$scope.showCompanies=false;										// close the Companies Window
			$scope.showCustomersOptions=false;								// close the SHOW customers window
			$scope.showEditCustomer=false;									// close the EDIT Customers Window
			$scope.showExitMessage=false;									// close the Exit Message
			
			$scope.showCustomers=true;										// open the Customers Window
			$scope.showHeaderMenu=true;										// open the back Menu in the header
			$scope.showCustMenu=true;										// open the Edit Customers's Menu
			
			// check if there is any subscribed companies
			if (getAdminArray("CUSTOMER") != null){							// force the customers list to be an array even if there is only one customer
				$scope.showCustomersButton=true;							// open the "show customers" button
				$scope.showNoCustomersErrorMessage=false;					// close the ERROR window
			}
			// NO COMPANIES
			else {
				
				$scope.showNoCustomersErrorMessage=true;					// open the ERROR window
				$scope.showCustomersButton=false;							// close the "show customers" button
			}
			
		}, 100);
	};
	
	/*
	 *-----------------------------------
	 *  OPEN SHOW CUSTOMERS VIEW OPTIONS
	 *-----------------------------------
	 */ 
	// open the page of the "Show Customers" button
	$scope.getCustomers=function(){
		
		// get the Admin model with the update collections of all customers from the database
		getAdmin("CUSTOMER");
		
		$timeout (function(){
				
			$scope.showSQLErrorMessage=false;							// close the SQL ERROR window
			$scope.showCustMenu=false;									// close the Customer Menu window
			$scope.showEditCustomer=false;								// close the EDIT Customers Window
			$scope.showAllCustCoupons = false;							// close the show customer's Coupons Window
			$scope.showNoCustomerCouponsErrorMessage = false;			// close the No Coupons ERROR window
			
			$scope.showCustomersOptions=true;							// open the Show Customers Window
			
			// check if there is any subscribed customers
			if (getAdminArray("CUSTOMER") != null){						// force the customers list to be an array even if there is only one customer
				
				$scope.showCustListMenu=true;							// open the Customer Main Menu window
				$scope.showNoCustomersErrorMessage=false;				// close the ERROR window
				
			}
			// NO CUSTOMERS
			else {														
				
				$scope.showNoCustomersErrorMessage=true;				// open the ERROR window
				$scope.showCustListMenu=false;							// close the Customer Coupons Main Menu window
			}
			
		}, 100);
	};
	
	/*
	 *--------------------
	 * SHOW ALL CUSTOMERS
	 *--------------------
	 */ 
	// SHOW ALL the Subscribed Customers
	$scope.showAllCustomers=function(){
		
		if($scope.showCustomersTable==false){
			
			// get the Admin model with the update collections of all customers from the database
			getAdmin("CUSTOMER");
				
			$timeout (function(){
			
				// check if there is any subscribed customers
				if (getAdminArray("CUSTOMER") != null){						// force the customers list to be an array even if there is only one customer
					
					if ($scope.customers.length == 1){ 						// if there is only one company in the list - we don't need the Sort Arrow
						
						$scope.oneCustomer = true;							// hide the Sort Arrow from the table's titles
						
					}else	$scope.oneCustomer = false;						// open the Sort Arrow in the table's titles
					
					$scope.showCustomersTable=true;							// open the SHOW ALL Customers window (the customers table)
					$scope.showAllCustomersErrorMessage=false;				// close the ERROR window
					
				}
				// NO CUSTOMERS
				else	$scope.showAllCustomersErrorMessage=true;			// open the ERROR window
			
			}, 100);
		}
		
		else 	$scope.showCustomersTable=false;						// close the SHOW ALL Customers window
	};
	
	/*
	 *-----------------------
	 * SHOW CUSTOMER BY NAME
	 *-----------------------
	 */ 
	// SHOW the NAME's LIST of all the customers
	$scope.getCustomersNameList=function(){
		
		if($scope.showCustomerNameList==false){
			
			// get the Admin model with the update collections of all companies from the database
			getAdmin("CUSTOMER");
			
			$timeout (function(){
				
				// check if there is any subscribed customers
				if (getAdminArray("CUSTOMER") != null){					// force the customers list to be an array even if there is only one customer
					
					$scope.showCustomerByNameErrorMessage=false;		// close the ERROR window
					
					if ($scope.customers.length == 1){ 					// if there is only one customer in the list - don't open the NAME list
						
						var customer = $scope.admin.customers;
						$scope.selectedCustName = customer.custName;
						$scope.getCustomerByName();						// get the customer by NAME 
					}
					
					else	$scope.showCustomerNameList=true;			// open the All Customers's NAME list window	
				
				}
				// NO CUSTOMERS
				else	$scope.showCustomerByNameErrorMessage=true;		// open the ERROR window
				
			}, 100);
		}
		
		else {
			
			$scope.showCustomerNameList=false;							// close the All Customers's NAME list window	
			$scope.showCustomerByName=false;							// close the table of the Customer of the selected NAME 
		}
	};
	/*
	 *----------------------
	 * GET CUSTOMER BY NAME
	 *----------------------
	 */
	// GET a Customer by its NAME
	$scope.getCustomerByName=function(){	
		
		$scope.customer = getObjectByName($scope.customers,$scope.selectedCustName, "CUSTOMER");
		
		if ($scope.customer != null)	$scope.showCustomerByName=true;	// open the table of the Customer of the selected NAME
		
		else		      $scope.showCantFindErrorMessage=true;			// open the ERROR window
	};
	
	/*
	 *--------------------
	 * GET CUSTOMER BY ID
	 *--------------------
	 */
	// GET a Customer by its ID
	$scope.getCustomerById=function(){	
		
		$scope.customer = getObjectById($scope.customers,$scope.selectedCustId);
		
		if ($scope.customer != null)	$scope.showCustomerById=true;	// open the table of the Customer of the selected ID
		
		else		      $scope.showCantFindErrorMessage=true;		// open the ERROR window
	};
	
	/*
	 *-----------------------------
	 * SHOW CUSTOMER'S COUPONS LIST
	 *-----------------------------
	 */
	// SHOW ALL Customer's Coupons
	$scope.showCustomerCoupons=function(id){
		
		// get the customer and its coupons by the selected Id
		getCustomerCoupons(id);
		
		$timeout (function(){
			console.log("webCustomer = " + $scope.webCustomer);
			if ($scope.webCustomer != null){
				
				$scope.showSQLErrorMessage=false;						// close the SQL ERROR window
				
				var coupons = $scope.webCustomer.coupons;
				console.log("coupons = " + coupons);
				// check if the customer has any coupons
				if (coupons != null){									
					
					$scope.showCustListMenu=false;						// close the Show Customer list Menu window
					$scope.showNoCustomersErrorMessage=false;			// close the No Customers ERROR window
					$scope.showNoCustomerCouponsErrorMessage=false;		// close the No Coupons ERROR window
					
					if ($scope.custCoupons.length == 1){ 				// if there is only one coupon in the list - we don't need the Sort Arrow
						
						$scope.oneCustCoupon = true;					// hide the Sort Arrow from the table's titles
						
					}else	$scope.oneCustCoupon = false;				// open the Sort Arrow in the table's titles
					
					$scope.showAllCustCoupons=true;						// open the SHOW ALL Customer's Coupons window
					
				}
				// NO COUPONS
				else 	{
					
					$scope.showNoCustomerCouponsErrorMessage=true;		// open the No Coupons ERROR window
				}
			}
			
			else	$scope.showSQLErrorMessage=true;					// open the SQL ERROR window
			
		}, 100);
	};
	
	//*******************************************************************************************************************************************//
	/*
	 ****************************
	 * 	 CUSTOMER EDIT WINDOW   *
	 ****************************
	 *
	 *---------------------
	 *  ADD A NEW CUSTOMER   
	 *---------------------
	 */
	// open the ADD Customer Form
	$scope.createCustomer=function(){
		
		resetAddCustomerForm();											// reset the Add Customer Form
		
		$scope.showCustMenu=false;										// close the Customer Menu window
		$scope.showCustomersOptions=false;								// close the Show Customers Window
		$scope.showUpdateCustForm=false;								// close the Update Customer Form 
		$scope.showAddConfirmMessage=false;								// close the Confirm Message
		
		$scope.showEditCustomer = true;									// open the Edit Customer Window
		$scope.showAddCustomerForm = true;								// open the Adding a new Customer Window
	};
	// ADD a new Customer to the Customers list
	$scope.addCustomer=function() {
		
        // putting the customer data from the Form into a JSON format
		var formCustomer = {				
				"custName": $scope.custName,
				"password": $scope.custPassword
		};
		
		// don't show "NULL" or "UNDEFINED" in the show coupon table in the client HTML page
		formCustomer = setObjNullFields(formCustomer);
		
		// adding the new coupon in the DataBase Tables
		$http.post("rest/admin/addCustomer", formCustomer).success(function(response) { $scope.addCustomerConfirm = response;});
		
		$timeout (function(){
			
			$scope.showAddCustomerConfirmMessage=true;					// open the Confirm Message window
			
			// if the operation succeeded - reset the Form for adding another customer
			if ($scope.addCustomerConfirm.startsWith("SUCCEED")){
				
				$timeout (function(){
					
					getAdmin("CUSTOMER");
					
					$timeout (function(){
						
						// check if there is any subscribed customers
						if (getAdminArray("CUSTOMER") == null){			// force the customers list to be an array even if there is only one customer
							
							$scope.addCustomerConfirm = "Sorry, there are no customers in the list"
							$scope.showAddCustomerConfirmMessage=true;	// open the Error Message window
						}
						
					}, 100);
					
					$scope.showAddCustomerForm=false;					// close the Add customer Form
					
					resetAddCustomerForm();								// reset the Add Customer Form
					
					$scope.showAddCustomerConfirmMessage=false;			// close the Confirm Message after reset
					$scope.showAddCustomerForm=true;					// open the Add customer Form after reset
					
				}, 2500);	
			}
		
		}, 100);
		
	};
	
	/*
	 * -----------------------
	 * REMOVE CUSTOMER BUTTON
	 * -----------------------
	 */
	// REMOVE the Customer (By its ID)
	$scope.removeCustomer=function(id){	
		
		$scope.showRemoveCustomerConfirmMessage=false;					// close the Confirm Message
		
		var confirmRemove = confirm("are you sure you want to remove customer " + id + "?");
		
		if (confirmRemove){
			
			$http.get("rest/admin/removeCustomer?custId=" + id).success(function(response) { $scope.removeCustomerMessage = response;});
			
			$timeout (function(){
				
			$scope.showRemoveCustomerConfirmMessage=true;				// open the Confirm Message
			
				$timeout (function(){
					
						$scope.refreshCustomer();						// refreshing and updating the "show customers" window after execute a delete action
						$scope.showRemoveCustomerConfirmMessage=false;	// close the Confirm Message
						
				}, 1500);
				
			}, 100);	
		}
	}
	
	/*
	 * -----------------------
	 * UPDATE CUSTOMER BUTTON
	 * -----------------------
	 */
	// open the UPDATE Form
	$scope.openUpdateCustForm=function(id){
		
		$scope.showUpdateCustomerConfirmMessage=false;						// close the Confirm Message
		
		var confirmUpdate = confirm("are you sure you want to update customer " + id + "?");
		
		if (confirmUpdate){
			
			// get the customer by the selected Id
			$scope.newCustomer = getObjectById($scope.customers,id);
			
			resetUpdateCustomerForm();										// reset the Update Customer Form
			
			$scope.showCustomersOptions=false;								// close the "show customers" window
			$scope.showAddCustomerForm=false;								// close the Add customer Form
			$scope.showAllCustCoupons=false;								// close the "Show customer's coupons" window
			
			$scope.showEditCustomer=true;									// open the "Edit Customer" window
			$scope.showUpdateCustForm=true;									// open the Update Customer Form
		}
	}
	// UPDATE the Customer (By its ID)
	$scope.updateCustomer=function(){	
		
		var confirmUpdate = confirm("are you sure you want to update customer " + $scope.newCustomer.custName + "?");
		
		// keep the previous values if the field hasn't been changed
		if ($scope.newCustPassword == "")		$scope.newCustPassword = $scope.newCustomer.password;
			
		if (confirmUpdate){
			
			$http.get("rest/admin/updateCustomer?custId=" + $scope.newCustomer.id + "&pass=" + $scope.newCustPassword)
																							.success(function(response) { $scope.updateCustomerMessage = response;});
			$timeout (function(){
				
				$scope.showUpdateCustomerConfirmMessage=true;				// open the Confirm Message
				
			}, 100);
		}
		// return to the "show customer's coupons" menu - reset the form and refresh 
		$timeout (function(){
			
			// if the operation succeeded - update the Customer's coupon list in the Model
			if ($scope.updateCustomerMessage.startsWith("SUCCEED")){
				
				//updating the Customer's list by getting it again from the DB
				getAdmin("CUSTOMER");
				
				$timeout (function(){
					
					$scope.customers = getAdminArray("CUSTOMER");			// force the customers list to be an array even if there is only one customer
				
				}, 100);
				
				resetUpdateCustomerForm();									// reset the Update Coupon Form
				
				$scope.refreshCustomer();									// refreshing and updating the "show coupon" window after execute an update action	
			}
			
		}, 2500);
	}
	
	//*******************************************************************************************************************************************//
	//												G E N E R A L(SHARED)   F U N C T I O N S			 		  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 *-------------------
	 *  GET OBJECT BY ID
	 *-------------------
	 */  
	// Get company/customer by its ID
	var getObjectById=function(list,id){
		
		var obj = null;
		
		for (i=0;i<list.length;i++){
			
			if (list[i].id == id){
				obj = list[i];
			}
		}
		
		return obj;
	};
	
	/*
	*---------------------
	*  GET OBJECT BY NAME
	*---------------------
	*/  
	// Get company/customer by its NAME
	var getObjectByName=function(list,name,type){
		
		var obj = null;
		var objName = null;
		
		for (i=0;i<list.length;i++){
			
			switch (type){
			
			case "COMPANY":
				objName = list[i].compName
				break;
				
			case "CUSTOMER":
				objName = list[i].custName
				break;
			}
			
			if (objName === name){
				obj = list[i];
			}
		}
		
		return obj;
	};
	
	/*
	 *-------------------------------------------------------------------
	 *  SET COMPANIES/CUSTOMERS LIST TO AN ARRAY AND WITHOUT NULL FIELDS
	 *-------------------------------------------------------------------
	 */  
	// convert the list to be an ARRAY and don't show "NULL" or "UNDEFINED" in the show tables in the client HTML page
	var setList=function(list){	
		
		// convert the list to an Array
		var showList = setArray(list);										
		
		// set NULL fields to "" (image or message)
		for (i=0;i<showList.length;i++){
			
			setObjNullFields(showList[i]);
		}
		
		return showList;
	};
	
	/*
	 *-------------------------------------------------------
	 *  SET COUPONS LIST TO AN ARRAY AND WITHOUT NULL FIELDS
	 *-------------------------------------------------------
	 */  
	// convert the coupons's list to be an ARRAY and don't show "NULL" or "UNDEFINED" in the show tables in the client HTML page
	var setCouponList=function(list){	
		
		// convert the list to an Array
		var coupons = setArray(list);										
		
		// set NULL fields to "" (image or message)
		for (i=0;i<coupons.length;i++){
			
			setCouponNullFields(coupons[i]);
		}
		
		return coupons;
	};
	
	/*
	 *---------------------
	 * CONVERT TO AN ARRAY
	 *---------------------
	 */  
	// Converting any list (even with only one entity) to be an array
	var setArray = function(list){
		
		if (list != null){
			
			var array = [];
			var obj = [];
			
			if (angular.isArray(list)){
				
				angular.forEach(list, function (obj) {
	        	
					array.push(obj);
				});
				
	    	}else{
	    		// converting the list of Coupons to an Array even if it has only one object in it
	    		array.push(list);
	    	}
						
		}else	array = null;
		
		return array;
	};
	
	/*
	 *------------------------------------------------------
	 *  COMPANY/CUSTOMER OBJECT -  SET "NULL" FIELDS TO "" 
	 *------------------------------------------------------
	 */  
	// don't show "NULL" or "UNDEFINED" in the show tables in the client HTML page
	var setObjNullFields=function(obj){	
		
		if (angular.isUndefined(obj.email) || obj.email == null)		obj.email = "";
		
		return obj;
	};
	
	/*
	 *------------------------------------------
	 *  COUPON OBJECT - SET "NULL" FIELDS TO ""
	 *------------------------------------------
	 */  
	// don't show "NULL" or "UNDEFINED" in the show tables in the client HTML page
	var setCouponNullFields=function(coupon){	
		
		if (angular.isUndefined(coupon.message)|| coupon.message == null)		coupon.message = "";
		if (angular.isUndefined(coupon.image)  || coupon.image == null )		coupon.image = "";
		
		return coupon;
	};
	
	//*******************************************************************************************************************************************//
	//										R E F R E S H / R E S E T / C L O S E / E X I T     B U T T O N S	  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 ********************
	 * 	REFRESH BUTTON  *
	 ********************
	 *
	 * -------------------------------
	 *  REFRESH "SHOW COMPANY" WINDOW
	 * -------------------------------
	 */
	// REFRESH the show Company Window - close the open inside windows, update information from the DataBase and re-open the inside windows
	$scope.refreshCompany=function(){
		
		var allCompanies;
		var companyNameList;
		var companyByName;
		
		// close all the open inside-show-windows
		if ($scope.showCompaniesOptions == true){
			$scope.showCompaniesOptions=false;
		}
		// close all the open inside-show-windows
		if ($scope.showCompListMenu == true){
			$scope.showCompListMenu=false;
		}
		// close all the open inside-show-windows
		if ($scope.showCompaniesTable == true){
			allCompanies = true;
			$scope.showCompaniesTable=false;
		}
		if ($scope.showCompanyNameList==true){
			companyNameList = true;
			$scope.showCompanyNameList=false;
		}
		if ($scope.showCompanyByName == true){
			companyByName = true;
			$scope.showCompanyByName=false;
		}
		
		// updating the company's list from the DataBase
		$scope.getCompanies();
				
		$timeout (function(){													// waiting so the companies list will be updated
			
			var companies = $scope.companies;
			
			// re-open the inside-show-windows that were open before the refresh (calling again to the functions that create the data inside these windows)
			if (allCompanies == true){
				$scope.showAllCompanies();										// show all companies list
				allCompanies = false;
			}
			
			if (companyNameList == true){
				$scope.getCompaniesNameList();									// all companies's NAME list
				companyNameList = false;
			}
			
			if (companyByName == true){
				$scope.getCompanyByName();										// the selected company by NAME
				companyByName = false;
			}
			
		}, 200);
	};
	
	/*
	 * -------------------------------
	 *  REFRESH "SHOW CUSTOMER" WINDOW
	 * -------------------------------
	 */
	// REFRESH the show Customer Window - close the open inside windows, update information from the DataBase and re-open the inside windows
	$scope.refreshCustomer=function(){
		
		var allCustomers;
		var customerNameList;
		var customerByName;
		
		// close all the open inside-show-windows
		if ($scope.showCustomersOptions == true){
			$scope.showCustomersOptions=false;
		}
		// close all the open inside-show-windows
		if ($scope.showCustListMenu == true){
			$scope.showCustListMenu=false;
		}
		// close all the open inside-show-windows
		if ($scope.showCustomersTable == true){
			allCustomers = true;
			$scope.showCustomersTable=false;
		}
		if ($scope.showCustomerNameList==true){
			customerNameList = true;
			$scope.showCustomerNameList=false;
		}
		if ($scope.showCustomerByName == true){
			customerByName = true;
			$scope.showCustomerByName=false;
		}
		
		// updating the customer's list from the DataBase
		$scope.getCustomers();
		
		$timeout (function(){													// waiting so the customers list will be updated
			
			var customers = $scope.customers;
			
			// re-open the inside-show-windows that were open before the refresh (calling again to the functions that create the data inside these windows)
			if (allCustomers == true){
				$scope.showAllCustomers();										// show all customers list
				allCustomers = false;
			}
			
			if (customerNameList == true){
				$scope.getCustomersNameList();									// all customers's NAME list
				customerNameList = false;
			}
			
			if (customerByName == true){
				$scope.getCustomerByName();										// the selected customer by NAME
				customerByName = false;
			}
			
		}, 200);
	};
	
	/*
	 *********************
	 * 	 RESET BUTTONS	 *
	 ********************* 
	 *
	 *---------------
	 * RESET A FORM
	 *---------------
	 */ 
	// reset a form
	$scope.resetForm = function(formName) {
		
		$scope[formName].$setPristine();								// reset the Form Data
		$scope[formName].$setUntouched();
	};
	
	/*
	 * -----------------------
	 * RESET ADD COMPANY FORM
	 * -----------------------
	 */
	var resetAddCompanyForm=function(){
		
		// zeroing the coupon data in the Form
		$scope.compName = "";				
		$scope.compPassword = "";				
		$scope.compEmail = "";
		
		$scope.showAddCompanyConfirmMessage = false;					// close the Message window
		
		$scope.resetForm("addCompForm");								// reset the Add Company Form
	};
	
	/*
	 * -----------------------
	 * RESET ADD CUSTOMER FORM
	 * -----------------------
	 */
	var resetAddCustomerForm=function(){
		
		// zeroing the coupon data in the Form
		$scope.custName = "";				
		$scope.custPassword = "";				
		
		$scope.showAddCustomerConfirmMessage = false;					// close the Message window
		
		$scope.resetForm("addCustForm");								// reset the Add Customer Form
	};
	
	/*
	 * ----------------------------
	 * RESET "UPDATE COMPANY" FORM
	 * ----------------------------
	 */
	var resetUpdateCompanyForm=function(){
		
		// zeroing the coupon data in the Form
		$scope.newCompPassword = "";
		$scope.newCompEmail = "";
		
		$scope.showUpdateCompanyConfirmMessage = false;					// close the Message window
		
		$scope.resetForm("updateCompForm");						 		// reset the Update Company Form
	};
	
	/*
	 * -----------------------------
	 * RESET "UPDATE CUSTOMER" FORM
	 * -----------------------------
	 */
	var resetUpdateCustomerForm=function(){
		
		// zeroing the coupon data in the Form
		$scope.newCustPassword = "";
		
		$scope.showUpdateCustomerConfirmMessage = false;				// close the Message window
		
		$scope.resetForm("updateCustForm");						 		// reset the Update Customer Form
	};
	
	/*
	 *********************
	 * 	 CLOSE BUTTONS	 *
	 ********************* 
	 *
	 * --------------------------------------
	 * CLOSE ALL COMPANY'S SELECTIONS BUTTON
	 * --------------------------------------
	 */
	// CLOSE all the inside-show-windows in the "show companies" Window
	$scope.closeShowCompanies=function(){
		
		// companies show-windows
		$scope.showCompaniesTable=false;
		$scope.showCompanyNameList=false;
		$scope.showCompanyByName=false;
		
		// ERROR MESSAGES
		$scope.showNoCompaniesErrorMessage=false;
		$scope.showSQLErrorMessage=false;
		$scope.showAllCompaniesErrorMessage=false;
		$scope.showCompanyByNameErrorMessage=false;
		$scope.showCantFindErrorMessage=false;
		$scope.showNoCompanyCouponsErrorMessage=false;
		
		// CONFIRM MESSAGE
		$scope.showRemoveCompanyConfirmMessage=false;
		$scope.showExitMessage=false;
	};
	
	/*
	* ---------------------------------------
	* CLOSE ALL CUSTOMER'S SELECTIONS BUTTON
	* ---------------------------------------
	*/
	// CLOSE all the inside-show-windows in the "show customers" Window
	$scope.closeShowCustomers=function(){
		
		// customers show-windows
		$scope.showCustomersTable=false;
		$scope.showCustomerNameList=false;
		$scope.showCustomerByName=false;
		
		// ERROR MESSAGES
		$scope.showNoCustomersErrorMessage=false;
		$scope.showSQLErrorMessage=false;
		$scope.showAllCustomerErrorMessage=false;
		$scope.showCustomerByNameErrorMessage=false;
		$scope.showCantFindErrorMessage=false;
		$scope.showNoCustomerCouponsErrorMessage=false;
		
		// CONFIRM MESSAGE
		$scope.showRemoveCustomerConfirmMessage=false;
		$scope.showExitMessage=false;
	};
	
	/*
	 * -----------------------------------------
	 * CLOSE BUTTON ON COMPANY'S COUPONS WINDOW
	 * -----------------------------------------
	 */
	// CLOSE the "Show company's Coupons" Window 
	$scope.closeCompCoupon=function(){
		
		$scope.showAllCompCoupons=false;								// close the company's coupons Window
		$scope.showCompaniesOptions=true;								// open the "show companies" Window
		$scope.showCompListMenu=true;									// open the "show companies" list Menu 
	};
	
	/*
	 * -----------------------------------------
	 * CLOSE BUTTON ON CUSTOMER'S COUPONS WINDOW
	 * -----------------------------------------
	 */
	// CLOSE the "Show customer's Coupons" Window 
	$scope.closeCustCoupon=function(){
		
		$scope.showAllCustCoupons=false;								// close the customer's coupons Window
		$scope.showCustomersOptions=true;								// open the "show customers" Window
		$scope.showCustListMenu=true;									// open the "show customers" list Menu 
	};
	
	/*
	 * -------------------------
	 * BACK TO MAIN MENU BUTTON
	 * -------------------------
	 */
	// CLOSE all windows and go back to the Main Menu window
	$scope.backToMainMenu=function(){
		
		// close the "show companies" window
		$scope.closeShowCompanies();									// close all the selections			
			$scope.showCompaniesOptions=false;							
		// close the "edit companies" window	
		$scope.showAddCompanyForm=false;								// close the Add company Form
		$scope.showUpdateCompForm=false;								// close the update company Form
			$scope.showEditCompany=false;								// close the Companies Window
		// close the companies window
				$scope.showCompMenu=false;								// close the Companies Menu
					$scope.showCompanies=false;							// close the Companies Window
					
		// close the "show customers" window
		$scope.closeShowCustomers();									// close all the selections			
			$scope.showCustomersOptions=false;							
		// close the "edit customers" window	
		$scope.showAddCustomerForm=false;								// close the Add customer Form
		$scope.showUpdateCustForm=false;								// close the update customer Form
			$scope.showEditCustomer=false;								// close the Customers Window
		// close the customers window
				$scope.showCustMenu=false;								// close the Customers Menu
					$scope.showCustomers=false;							// close the Customers Window			
					
		$scope.showHeaderMenu=false;									// close the right Menu in the header
		$scope.showMainMenu=true;										// open the Main Menu window
	};
	
	/*
	 ****************************
	 * 	Button 3:  EXIT BUTTON  *
	 ****************************
	 */
	// EXIT the Company Page back to the LOGIN page
	$scope.exit=function(){
		
		// closing the Coupon System 
		$http.get("rest/admin/exit").success(function(response) { $scope.exitMessage = response;});
		$scope.showWelcomeMessage = false;								// close the welcome message
		$scope.showExitMessage = true;									// open the goodbye message
		
		$timeout (function(){$window.location.href = 'http://localhost:8080/com.tzahia/login.html';}, 2000);
	};
});

