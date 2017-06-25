/**
 * 	Company Page Controller	
 */
//angular.module('couponSystem', ['ngMaterial']);
var app = angular.module('couponSystem', []);
	
	app.controller('compCtrl', function($scope, $http, $window, $timeout) {
	
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
	// COUPONS show-windows
	//---------------------
	// SHOW COUPONS show-windows
	$scope.showCompCoupons=false;
	$scope.showAllCoupons=false;
	$scope.oneCoupon = false;												// ng-hide: open the Sort Arrows in the table's titles
	$scope.showCouponTitleList=false;
	$scope.showCompCouponByTitle=false;
	$scope.showCouponPrices=false;
	$scope.showPriceList=false;
	$scope.showCompCouponByPrice=false;
	$scope.showCouponDates=false;
	$scope.showDatePicker=false;
	$scope.showCompCouponByDate=false;
	// EDIT COUPONS show-windows
	$scope.showEditCoupon = false;
	$scope.showIdToRemove = false;
	$scope.showIdToUpdate = false;
	$scope.showUpdateForm = false;
	$scope.showAddCouponForm = false;
	// ERROR MESSAGES - SHOW Coupons show-windows 
	$scope.showNoCouponsErrorMessage=false;
	$scope.showAllCouponsErrorMessage=false;
	$scope.showByTitleErrorMessage=false;
	$scope.showByPriceErrorMessage=false;
	$scope.showListByPriceErrorMessage=false;
	$scope.showByDateErrorMessage=false;
	$scope.showListByDateErrorMessage=false;
	// CONFIRM MESSAGE show-window
	$scope.showRemoveConfirmMessage=false;
	$scope.showUpdateConfirmMessage=false;
	$scope.showAddConfirmMessage=false;
	$scope.showExitMessage=false;
	
	/*
	 *********************************************************************
	 *     INITIALIZE and DEFINE $SCOPE VARIABLES and START-UP Actions 	 * 
	 *********************************************************************
	 */
	//---------------------------------------
	// initialize Confirm and Error MESSAGES
	//---------------------------------------
	$scope.sqlErrorMessage = "An ERROR occured while trying to get data from the DataBase";
	$scope.cantFindErrorMessage = "Can't find!";
	$scope.noCouponsErrorMessage = "Sorry, you don't have any coupons ";
	
	//-------------------------------------
	// define Objects and Arrays VARIABLES
	//-------------------------------------
	$scope.compCoupons = null;										
	$scope.typeList = null;											
	$scope.newCoupon = null;
	$scope.interval = 50.0;													// set the range between the prices in the Price List
	$scope.today=new Date();												// define "today" for the minimum date of the Start Date of the Coupon
	
	//-----------------
	// START-UP ACTION
	//-----------------
	// start-up: get the Logged in Company Name
	$http.get("rest/company/getCompName").success(function(response) { $scope.compName = response;});
	
	$timeout (function(){
		
		if ($scope.compName == null)	$scope.showSQLErrorMessage=true;	// if there is no Company Object - open the SQL ERROR window		
		
	}, 100);
	
	
	//*******************************************************************************************************************************************//
	//														E V E V T S     F U N C T I O N S			 		  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 *******************************
	 *  GET OBJECTS FROM DATABASE  * 
	 *******************************
	 *
	 *---------------
	 *  GET COMPANY
	 *---------------
	 */ 
	// get the logged in company from the DB and its list of Coupons
	var getCompany = function(){
		
		$http.get("rest/company/getCompany").success(function(response) { $scope.company = response;});
		
	};
	
	/*
	 *-----------------------------------------------
	 *  CONVERT THE COUPON'S COLLECTIONS TO AN ARRAY 
	 *-----------------------------------------------
	 */ 
	// convert the coupons collections in the Company Model to an Array 
	var getCouponsArray = function(){
	
		var coupons = null;
	
		if ($scope.company != null){
			
			coupons = $scope.company.coupons;						// get the update Company's Coupons from the database
			console.log("coupons = " + $scope.company.coupons);
			
			if (coupons != null){									// check if the company has any coupons
				
				$scope.compCoupons = setCouponsList(coupons)		// force the coupons list to be an array and without NULL fields
				coupons = $scope.compCoupons;
				
			}
		}
		
		return coupons;												// return the Company's Coupons List
	
	};
	
	/*
	 *------------------------
	 *  GET COMPANY'S COUPONS
	 *------------------------
	 */ 
	// get the company's coupons from the DB 
	var getCompCoupons = function(){
		
		$http.get("rest/company/getCompCoupons").success(function(response) { $scope.compCoupons = response;});
		
		// do this block only after 100 milliseconds (wait for the response of the $http request)
		$timeout (function(){
			
			var coupons = $scope.compCoupons;						// get the update Company Coupons from the database
			
			if (coupons != null){									// check if the company has any coupons
				
				$scope.compCoupons = setCouponsList(coupons)		// force the coupons list to be an array and without NULL fields
			}
			
		}, 100);		
	};
	
	//*******************************************************************************************************************************************//
	//										Button 1 :		S H O W     C O U P O N  S      W I N D O W 			 		  		 			 //
	//*******************************************************************************************************************************************//
	/*
	 *-----------------------------
	 * SHOW COMPANY'S COUPONS MENU
	 *-----------------------------
	 */ 
	// open the page of the "Show My Coupons" button
	$scope.showCoupons = function(){
		
		// get the update Company model with its update collections of coupons from the database
		getCompany();												
		
		$timeout (function(){
			
			if ($scope.company != null){					
				
				$scope.showSQLErrorMessage=false;					// close the SQL ERROR window
				$scope.showMainMenu=false;							// close the Main Menu window
				$scope.showAddCouponForm=false;						// close the Add Coupon Form Window
				$scope.showEditCoupon=false;						// close the EDIT Coupon Window
				$scope.showIdToRemove = false;						// close the Remove Coupon "select id" Window
				$scope.showIdToUpdate = false;						// close the Update Coupon "select id" Window
				$scope.showUpdateForm = false;						// close the Update Coupon Form Window
				$scope.showRemoveConfirmMessage = false;			// close the Remove Coupon Confirm Message Window
				$scope.showUpdateConfirmMessage = false;			// close the Update Coupon Confirm Message Window
				$scope.showHeaderMenu=true;							// open the back Menu in the header
				
				$scope.showCompCoupons=true;						// open the Company Coupons window
				
				if (getCouponsArray() != null){						// check if the company has any coupons
				
					console.log("compCoupons = " + $scope.compCoupons);
					defineCouponTable();							// define sorting method of the rows and columns in the Coupons Table
					
					$scope.showCompCouponsMenu=true;				// open the Company Coupons Main Menu window
					$scope.showNoCouponsErrorMessage=false;			// close the ERROR window
					
				}
				
				else{												// NO COUPONS
					
					$scope.compCoupons = null;
					$scope.showNoCouponsErrorMessage=true;			// open the ERROR window
					$scope.showCompCouponsMenu=false;				// close the Company's Coupons Main Menu window
				}
			}
			
			else	$scope.showSQLErrorMessage=true;				// open the SQL ERROR window
			
		}, 100);
	};
	
	/*
	 *------------------
	 * SHOW ALL COUPONS
	 *------------------
	 */ 
	// SHOW ALL Company Coupons
	$scope.getAllCompCoupons=function(){
		
		if($scope.showAllCoupons==false){
			
			if (getCouponsArray() != null){							// check if the company has any coupons
				
				if ($scope.compCoupons.length == 1){ 				// if there is only one coupon in the list - we don't need the Sort Arrow
				
					$scope.oneCoupon = true;						// hide the Sort Arrow from the table's titles
					
				}else	$scope.oneCoupon = false;					// open the Sort Arrow in the table's titles
				
				$scope.showAllCoupons=true;							// open the SHOW ALL Company's Coupons window
				$scope.showAllCoponsErrorMessage=false;				// close the ERROR window
				
			}
			
			else{													// NO COUPONS
				
				$scope.compCoupons = null;
				$scope.showAllCoponsErrorMessage=true;				// open the ERROR window
			}
		}
		
		else 	$scope.showAllCoupons=false;						// close the SHOW ALL Company's Coupons window
	};
	
	/*
	 *----------------------
	 * SHOW COUPON BY TITLE
	 *----------------------
	 */ 
	// SHOW the ID's LIST of all the company's coupons
	$scope.getCompCouponTitleList=function(){
		
		if($scope.showCompCouponByTitle==false){
			
			if (getCouponsArray() != null){							// check if the company has any coupons
				
				$scope.showByTitleErrorMessage=false;				// close the ERROR window
				
				if ($scope.compCoupons.length == 1){ 				// if there is only one coupon in the list - don't open the Title list
					
					var coupon = $scope.company.coupons;
					$scope.selectedCouponTitle = coupon.title;
					$scope.getCompCouponByTitle();					// show the coupon table
					
				}else	$scope.showCouponTitleList=true;			// open the TITLE list of ALL Company's Coupons window
				
			}
			
			else{													// NO COUPONS
				
				$scope.compCoupons = null;
				$scope.showByTitleErrorMessage=true;				// open the ERROR window
			}
		}
		
		else {
			$scope.showCouponTitleList=false;						// close the TITLE list of ALL Company's Coupons window	
			$scope.showCompCouponByTitle=false;						// close the window of the Coupon of the selected Title 
		}
	};
	// SHOW a company's coupon by TITLE
	$scope.getCompCouponByTitle=function(){	
		
		$scope.compCoupon = getCouponByTitle($scope.compCoupons,$scope.selectedCouponTitle);
		
		$scope.showCompCouponByTitle=true;							// open the window of the Coupon of the selected Title
	};
	
	/*
	 *-----------------------
	 * SHOW COUPONS BY PRICE
	 *-----------------------
	 */
	// create a PRICE LIST 
	$scope.getPricesList=function(){
		
		if($scope.showCouponPrices==false){
			
			if (getCouponsArray() != null){							// check if the company has any coupons
				
				$scope.showCouponPrices=true;						// open the select by PRICE Range window of ALL Company's Coupons window
				$scope.showByPriceErrorMessage=false;				// close the ERROR window
				
				if ($scope.compCoupons.length == 1){ 				// if there is only one coupon in the list - don't open the PRICE Range list
					
					$scope.showPriceList=false;						// close the Price list of ALL Purchased Coupons window
					
					var coupon = $scope.company.coupons;
					$scope.selectedPrice = coupon.price;
					$scope.oneCoupon = true;						// hide the Sort Arrow from the table's titles
					
					$scope.getCompCouponsByPrice();					// show the coupon table
				}
				
				else {
					// get the Price Range of the Customer purchased coupons
					var minPrice = $scope.company.minPrice;
					var maxPrice = $scope.company.maxPrice;
					$scope.priceList = createPricesList(minPrice, maxPrice);
					
					if ($scope.priceList.length == 1){ 				// if there is only one price-range in the price list - don't open the PRICE list
						
						$scope.showPriceList=false;					// close the Price list of ALL Company's Coupons window
						$scope.selectedPrice = $scope.priceList[0].max;	// set the price to the only one that is on the price list
						$scope.getCompCouponsByPrice();				// show the coupon table
					}
					
					else {
						
						$scope.showPriceList=true;				// open the Price list of ALL Company's Coupons window
						$scope.oneCoupon = false;						// open the Sort Arrow in the table's titles
					}
				}
			}
			
			else {													// NO COUPONS
				
				$scope.compCoupons = null;
				$scope.showByPriceErrorMessage=true;				// open the ERROR window
				$scope.showCompCouponByPrice=false;						// close the window of the list of Company's Coupons of the selected Price Range
				$scope.showPriceList=false;							// close the Price Range list of ALL Company's Coupons window
			}
		}
		
		else {
			
			$scope.showCompCouponByPrice=false;						// close the window of the list of Company's Coupons of the selected Price Range
			$scope.showPriceList=false;								// close the Price Range list of ALL Company's Coupons window
			$scope.showCouponPrices=false;							// close the select by PRICE Range window of ALL Company's Coupons window
		}
	};
	// show purchased coupons by PRICE
	$scope.getCompCouponsByPrice=function(){
		// get the list of all the Purchased Coupons of the selected Price Range
		var coupons = $scope.compCoupons;
		var price = $scope.selectedPrice;
		$scope.couponsByPrice = getCouponsByPrice(coupons,price);
		
		$timeout (function(){
			
			var list = $scope.couponsByPrice;
			
			if (list != ""){										// check if the company has any coupons of the selected price range
				
				$scope.showCompCouponByPrice=true;					// open the window of the list of Coupons of the selected price range 
				$scope.showListByPriceErrorMessage=false;			// close the ERROR window
				
			}
			
			else{													// NO COUPONS
				
				$scope.showListByPriceErrorMessage=true;			// open the ERROR window
				$scope.showCompCouponByPrice=false;					// close the window of the list of Coupons of the selected price range
			}
			
		}, 100);
	};
	
	/*
	 *------------------------------
	 * SHOW COUPONS BY EXPIRED DATE
	 *------------------------------
	 */
	// open the Date Picker to choose a maximum End Date
	$scope.openDatePicker=function(){
		
		// init the default value to be TODAY
		$scope.today = new Date();
		
		if($scope.showCouponDates==false){							
			
			$timeout (function(){
				
				if (getCouponsArray() != null){							// check if the company has any coupons
					
					$scope.showCouponDates=true;						// open the select by Date window of ALL Company's Coupons window
					$scope.showByDateErrorMessage=false;				// close the ERROR window
				
					if ($scope.compCoupons.length == 1){ 				// if there is only one coupon in the list - don't open the Date picker
						
						$scope.showDatePicker=false;					// close the Date Picker window
						$scope.inputDate = $scope.compCoupons[0].endDate;
						$scope.oneCoupon = true;						// hide the Sort Arrow from the table's titles
						
						$scope.getCompCouponsByDate();					// show the coupon table
					}
					
					else {
						$scope.showDatePicker=true;						// open the Date Picker window
						$scope.oneCoupon = false;						// open the Sort Arrow in the table's titles
					}
				}
				
				else {													// NO COUPONS
					
					$scope.compCoupons = null;
					$scope.showListByDateErrorMessage=true;				// open the ERROR window
				}
				
			}, 200);
		}
		
		else {
			
			$scope.showCompCouponByDate=false;								// close the window of the list of the Company's Coupons of the selected End Date
			$scope.showDatePicker=false;								// close the Date Picker window
			$scope.showCouponDates=false;								// close the window of the list of Coupons of the selected End Date
		}	
	};
	// show Company's coupons by END DATE
	$scope.getCompCouponsByDate=function(){
		// get the list of all the Company's Coupons of the selected End Date
		var coupons = $scope.compCoupons;
		var maxDate = new Date($scope.inputDate);
		$scope.couponsByDate = new Array();
		
		for (i=0; i<coupons.length; i++){
			
			var endDate = new Date(coupons[i].endDate);
			if (endDate <= maxDate)			$scope.couponsByDate.push(coupons[i]);
			
		}
		
		$timeout (function(){
			
			var list = $scope.couponsByDate;
			
			if (list != ""){										// check if the company has any coupons of the selected expired date
				
				$scope.showCompCouponByDate=true;					// open the window of the list of the Company's Coupons of the selected price range 
				$scope.showListByDateErrorMessage=false;			// close the ERROR window
			}
			
			else{													// NO COUPONS
				
				$scope.showListByDateErrorMessage=true;				// open the ERROR window
				$scope.showCompCouponByDate=false;					// close the window of the list of Company's Coupons of the selected end date
			}
			
		}, 100);
	};
	

	//*******************************************************************************************************************************************//
	//										Button 2 :		E D I T    C O U P O N  S      W I N D O W 			 			  		 			 //
	//*******************************************************************************************************************************************//
	/*
	 *********************************
	 *  Button 2 : ADD A NEW COUPON  *  
	 *********************************
	 */
	// open the ADD Coupon Form
	$scope.createCoupon=function(){
		
		resetAddCouponForm();											// reset the Add Coupon Form
		
		$scope.showMainMenu=false;										// close the Main Menu window
		$scope.showCompCoupons=false;									// close the Show Coupon Window
		$scope.showUpadteForm=false;									// close the Update Form Window
		$scope.showAddConfirmMessage=false;								// close the Confirm Message
		$scope.showHeaderMenu=true;										// open the back Menu in the header
		$scope.showEditCoupon=true;										// open the EDIT Coupon Window
		$scope.showAddCouponForm = true;								// open the Adding a new Coupon Window
		
		// get the list of all the coupon's types (for the "select type" in the Add a New Coupon Form)
		$http.get("rest/company/getCouponTypes").success(function(response) { $scope.typesList = response;});	
		
		$timeout (function(){
			
			$scope.typesList = setArray($scope.typesList.typesList);	// force the coupons Type's list to be an array
			$scope.showAddCouponForm = true;							// open the Form of Adding a new Coupon
			
		}, 100);
	};
	// ADD a new Coupon to the Company's Coupons list
	$scope.addCoupon=function() {
		
		$scope.showSQLErrorMessage=false;								// close the SQL ERROR window
		
		// set the full path of the image name
		if(angular.isDefined($scope.image) && $scope.image != null)		$scope.uploadImage();
		
        // putting the coupon data from the Form into a JSON format
		var formCoupon = {				
				"title": $scope.title,
				"startDate": $scope.startDate,
				"endDate": $scope.endDate,
				"amount": $scope.amount,
				"type": $scope.selectedCouponType,
				"message": $scope.message,
				"price": $scope.price,
				"image": $scope.image
		};
		
		// don't show "NULL" or "UNDEFINED" in the show coupon table in the client HTML page
		formCoupon = setNullFields(formCoupon);
		
		// adding the new coupon in the DataBase Tables
		$http.post("rest/company/addCoupon", formCoupon).success(function(response) { $scope.messageConfirm = response;});
		
		$timeout (function(){
			
			$scope.showAddConfirmMessage=true;							// open the Confirm Message
			
			if ($scope.messageConfirm != null){
				
				// if the operation succeeded - reset the Form for adding another coupon
				if ($scope.messageConfirm.startsWith("SUCCEED")){
					
					$timeout (function(){
						
						//updating the Compan's list of coupons by calling the Get Company Coupons function
						$scope.compCoupons = getCompCoupons($scope.company);
						
						if ($scope.compCoupons == null)		$scope.messageConfirm = $scope.noCouponsErrorMessage;	
						
						$scope.showAddCouponForm=false;						// close the Add coupon Form
						$scope.showAddConfirmMessage=false;					// close the Confirm Message after reset
						
						resetAddCouponForm();								// reset the Add Coupon Form
						
						$scope.showAddCouponForm=true;						// open the Add coupon Form after reset
						
					}, 2500);	
				}
				
				else	$scope.showSQLErrorMessage=true;					// if there is no message from the service - open the SQL ERROR window	
			}
		
		}, 100);
		
	};
	
	 /*
	 * ---------------------
	 *   UPLOAD AN IMAGE
	 * ---------------------
	 */
	// UPLOAD an image from the image directory
	$scope.uploadImage=function() {
		
		var fileChoosen = document.getElementById("imgName").files[0];
		
		if(angular.isDefined(fileChoosen) && fileChoosen != null){
			
			var imageName = fileChoosen.name;								// get the file name of the image
			$scope.image = "/CouponProject/images/" + imageName;			// adding the path name to the file image name
		}
		else	$scope.image = null;
	}
	
	 /*
	 * ---------------------
	 * REMOVE COUPON BUTTON
	 * ---------------------
	 */
	// REMOVE the Coupon (By its ID)
	$scope.removeCoupon=function(id){	
		
		$scope.showSQLErrorMessage=false;									// close the SQL ERROR window
		$scope.showRemoveConfirmMessage=false;								// close the Confirm Message
		
		var confirmRemove = confirm("are you sure you want to remove coupon " + id + "?");
		
		if (confirmRemove){
			
			$http.get("rest/company/removeCoupon?coupId=" + id).success(function(response) { $scope.removeMessage = response;});
			
			$timeout (function(){
				
				if ($scope.messageConfirm != null){
					
					$scope.showRemoveConfirmMessage=true;					// open the Confirm Message
					
					$timeout (function(){
						
						$scope.refresh();									// refreshing and updating the "show coupon" window after execute a delete action
						
					}, 1500);
				}
				
				else	$scope.showSQLErrorMessage=true;					// if there is no message from the service - open the SQL ERROR window	
				
			}, 100);
		}
	}
	
	/*
	 * ---------------------
	 * UPDATE COUPON BUTTON
	 * ---------------------
	 */
	// open the UPDATE Form
	$scope.openUpdateForm=function(id){
		
		$scope.showUpdateConfirmMessage=false;								// close the Confirm Message
		
		var confirmUpdate = confirm("are you sure you want to update coupon " + id + "?");
		
		if (confirmUpdate){
			
			// get the coupon by the selected Id
			$scope.newCoupon = getCouponById($scope.compCoupons,id);
			
			resetUpdateCouponForm();										// reset the Update Coupon Form
			
			$scope.showCompCoupons=false;									// close the Show Coupons Window
			$scope.showAddCouponForm = false;								// close the Adding a new Coupon Window
			$scope.showAddConfirmMessage=false;								// close the Confirm Message
			$scope.showEditCoupon=true;										// open the EDIT Coupon Window
			$scope.showUpdateForm = true;									// open the Update Coupon Form Window
		}
	}
	// UPDATE the Coupon (By its ID)
	$scope.updateCoupon=function(){	
		
		$scope.showSQLErrorMessage=false;									// close the SQL ERROR window
		var confirmUpdate = confirm("are you sure you want to update coupon " + $scope.newCoupon.id + "?");
		
		// keep the previous values if the field hasn't been changed
		if ($scope.newEndDate == "")						$scope.newEndDate = $scope.newCoupon.endDate;
		if ($scope.newPrice == "")							$scope.newPrice	= $scope.newCoupon.price;
		
		var eDate = formatDate($scope.newEndDate);
			
		if (confirmUpdate){
			
			$http.get("rest/company/updateCoupon?coupId=" + $scope.newCoupon.id + "&edate=" + eDate + "&price=" + $scope.newPrice)
																							.success(function(response) { $scope.updateMessage = response;});
			
			$timeout (function(){
				
				if ($scope.messageConfirm != null){
					
					$scope.showUpdateConfirmMessage=true;					// open the Confirm Message
				}
				
				else	$scope.showSQLErrorMessage=true;					// if there is no message from the service - open the SQL ERROR window
				
			}, 100);
			
		}
		// return to the "show company's coupons" menu - reset the form and refresh 
		$timeout (function(){
			
			// if the operation succeeded - update the Company's coupon list in the Model
			if ($scope.updateMessage.startsWith("SUCCEED")){
				
				//updating the Company's list of coupons by calling the Get Company Coupons function 
				$scope.compCoupons = getCompCoupons($scope.company);
				
				resetUpdateCouponForm();									// reset the Update Coupon Form
				
				$scope.refresh();											// refreshing and updating the "show coupon" window after execute an update action	
			}
			
		}, 2500);
	}
	
	//*******************************************************************************************************************************************//
	//												G E N E R A L(SHARED)   F U N C T I O N S			 		  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 *-------------------
	 *  GET COUPON BY ID
	 *-------------------
	 */  
	// Get coupon by its ID
	var getCouponById=function(list,id){	
		
		for (i=0;i<list.length;i++){
			
			if (list[i].id == id)		var coupon = list[i];
		}
		
		return coupon;
	};
	
	/*
	*----------------------
	*  GET COUPON BY TITLE
	*----------------------
	*/  
	// Get coupon by its TITLE
	var getCouponByTitle=function(list,title){	
		
		for (i=0;i<list.length;i++){
			
			if (list[i].title === title)		var coupon = list[i];
		}
		
		return coupon;
	};
	
	/*
	*---------------------------
	*  DEFINE THE COUPONS TABLE 
	*---------------------------
	*/  
	// define the rows and columns in the Coupons Table
	var defineCouponTable=function(){
		
		$scope.sort = {
				type: 'id',
				reverse: false
		};
	};
	
	/*
	 *-------------------------------------------------------
	 *  SET COUPONS LIST TO AN ARRAY AND WITHOUT NULL FIELDS
	 *-------------------------------------------------------
	 */  
	// convert to Array and don't show "NULL" or "UNDEFINED" in the show coupon table in the client HTML page
	var setCouponsList=function(list){	
		
		// convert the list to an Array
		var coupons = setArray(list);										
		
		// set NULL fields to "" (image or message)
		for (i=0;i<coupons.length;i++){
			
			setNullFields(coupons[i]);
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
	 *-----------------------------------
	 *  SET COUPON'S "NULL" FIELDS TO ""
	 *-----------------------------------
	 */  
	// don't show "NULL" or "UNDEFINED" in the show coupon table in the client HTML page
	var setNullFields=function(coupon){	
		
		if (angular.isUndefined(coupon.message)|| coupon.message == null)		coupon.message = "";
		if (angular.isUndefined(coupon.image)  || coupon.image == null )		coupon.image = "";
		
		return coupon;
	};
	
	/*
	 *-------------------------
	 *  GET ALL COUPON'S TYPES
	 *-------------------------
	 */ 
	// get a list of all Coupon's Types of the Company Coupons 
	var getCouponTypes = function(coupons,types){
		
		var couponTypes = [];
		
		if (coupons.length > 1){
			
			angular.forEach(types, function (value,key) {
				
				couponTypes.push(value);
			});
			
		}else{
			// converting compCoupons to an Array even if it has only one object in it
			couponTypes.push(types);
		}
			
		return couponTypes;
	};
	
	/*
	 *----------------------
	 *  CREATE A PRICE LIST
	 *----------------------
	 */ 
	// create a PRICE LIST in interval of 50 NIS
	var createPricesList=function(minPrice, maxPrice){
		
		// get the Price Range of the Coupons
		var minDivide = minPrice/$scope.interval;
		var minModulu = (minPrice%$scope.interval)/$scope.interval;
		var maxDivide = maxPrice/$scope.interval;
		var maxModulu = (maxPrice%$scope.interval)/$scope.interval;
		var intMinPrice = minDivide - minModulu;
		var intMaxPrice = maxDivide - maxModulu;
		var times = 1;
		var i = 0;
		
		// set the start price
		if (minPrice<$scope.interval)						i = 0;
		else if (minPrice == maxPrice || minModulu == 0)	i = intMinPrice - 1;		
		else 												i = intMinPrice;
		
		//set the size of the price range
		if (maxModulu == 0)	 								times = intMaxPrice;
		else 					 							times = intMaxPrice + 1;
		
		// set the Price List of the Coupons
		var priceList =  new Array();
		
		for (i; i < times ; i++){
			
			priceList.push({ min: $scope.interval*i , max: $scope.interval*i + $scope.interval});
		}
		
		return priceList;
	};
	
	/*
	 *----------------------
	 *  GET COUPON BY PRICE
	 *----------------------
	 */ 
	// get a list of coupons by selected PRICE
	var getCouponsByPrice=function(coupons,price){
		
		var couponsByPrice = new Array();
		var maxPrice = price*1.0;
		var minPrice = (maxPrice - $scope.interval)*1.0;
		
		for (i=0; i<coupons.length; i++){
			
			if (coupons[i].price > minPrice && coupons[i].price <= maxPrice){
				
				couponsByPrice.push(coupons[i]);
			}
		}
		
		return couponsByPrice;
	};
	
	/*
	 *-------------------------
	 *  CONVERT DATE TO STRING
	 *-------------------------
	 */ 
	// convert Date Object to a string in format "yyyy-mm-dd";
	var formatDate=function(date){
		
	    var d = new Date(date),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

	    return [year, month, day].join('-');
	};
	
	//*******************************************************************************************************************************************//
	//										R E F R E S H / R E S E T / C L O S E / E X I T     B U T T O N S	  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 ********************
	 * 	REFRESH BUTTON  *
	 ********************
	 */
	// REFRESH the show Coupons Window - close the open inside windows, update information from the DataBase and re-open the inside windows
	$scope.refresh=function(){
		
		var all;
		var titleList;
		var couponByTitle;
		var priceList;
		var couponsByPrice;
		var datePicker;
		var couponsByDate;
		
		// close all the open inside-show-windows
		if ($scope.showCompCoupons == true){
			$scope.showCompCoupons=false;
		}
		// close all the open inside-show-windows
		if ($scope.showCompCouponsMenu == true){
			$scope.showCompCouponsMenu=false;
		}
		// close all the open inside-show-windows
		if ($scope.showAllCoupons == true){
			all = true;
			$scope.showAllCoupons=false;
		}
		if ($scope.showCouponTitleList==true){
			titleList = true;
			$scope.showCouponTitleList=false;
		}
		if ($scope.showCompCouponByTitle == true){
			couponByTitle = true;
			$scope.showCompCouponByTitle=false;
		}
		if ($scope.showCouponPrices == true){
			$scope.showCouponPrices=false;
		}
		if ($scope.showPriceList == true){
			priceList = true;
			$scope.showPriceList=false;
		}
		if ($scope.showCompCouponByPrice == true){
			couponsByPrice = true;
			$scope.showCompCouponByPrice=false;
		}
		if ($scope.showCouponDates == true){
			$scope.showCouponDates=false;
		}
		if ($scope.showDatePicker == true){
			datePicker = true;
			$scope.showDatePicker=false;
		}
		if ($scope.showCompCouponByDate == true){
			couponsByDate = true;
			$scope.showCompCouponByDate=false;
		}
		
		// updating the company's coupons from the DataBase
		$scope.showCoupons();
		
		$timeout (function(){													// waiting so the coupons list will be updated
			
			var coupons = $scope.compCoupons;
			
			// re-open the inside-show-windows that were open before the refresh (calling again to the functions that create the data inside these windows)
			if (all == true){
				$scope.getAllCompCoupons();										// all company's coupons list
				all = false;
			}
			
			if (titleList == true){
				$scope.getCompCouponTitleList();								// all company's coupons TITLE list
				titleList = false;
			}
			
			if (couponByTitle == true){
				$scope.getCompCouponByTitle();									// the selected company's coupon by TITLE
				couponByTitle=false;
			}
			
			// by Price Range
			if (priceList == true){
				$scope.getPricesList();											//	the PRICE RANGE list
				priceList = false;
			}
			// all company's coupons list of the selected PRICE RANGE
			if (couponsByPrice == true){		
				// open the coupons details window only if there are any coupons left of the previous selected PRICE RANGE
				var couponsByPriceList = 0;
				
				for(i=0;i<$scope.priceList.length;i++){
					
					if ($scope.priceList[i].max <= $scope.selectedPrice && $scope.priceList[i].max > ($scope.selectedPrice - $scope.interval))
						
						couponsByPriceList++;
					
				}
				
				if (couponsByPriceList != 0)	$scope.getCompCouponsByPrice();		// open the coupons details window
				
				couponsByPrice = false;
			}
			
			// by Expired Date
			if (datePicker == true){
				$scope.openDatePicker();											//	open the Date Picker window
				datePicker = false;
			}
			// all company's coupons list of the selected EXPIRED DATE
			if (couponsByDate == true){	
				// open the coupons details window only if there are any coupons left of the the previous selected EXPIRED DATE
				var couponsByDateList = 0;
				var maxDate = new Date($scope.inputDate);
				
				for(i=0;i<coupons.length;i++){
					
					var endDate = new Date(coupons[i].endDate);
					
					if (endDate <= maxDate)			couponsByDateList++;
				}
				
				if (couponsByDateList != 0)		$scope.getCompCouponsByDate();		// open the coupons details window
				
				couponsByDate = false;
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
	 * ----------------------
	 * RESET ADD COUPON FORM
	 * ----------------------
	 */
	var resetAddCouponForm=function(){
		
		// reset the file name of the image
		var fileChoosen = document.getElementById("imgName").files[0];		 
		
		if(angular.isDefined(fileChoosen) && fileChoosen != null){
			fileChoosen.name = null;		
			$scope.uploadImage();
		}
		
		// zeroing the coupon data in the Form
		$scope.title = "";				
		$scope.startDate = "";				
		$scope.endDate = "";				
		$scope.amount = "";				
		$scope.selectedCouponType = "";				
		$scope.price = "";
		$scope.message = "";
		$scope.image = "";				
		
		$scope.showAddConfirmMessage = false;							// close the Message window
		
		$scope.resetForm("addCouponForm");								// reset the Add Coupon Form
	};
	
	/*
	 * -------------------------
	 * RESET UPDATE COUPON FORM
	 * -------------------------
	 */
	var resetUpdateCouponForm=function(){
		
		// zeroing the coupon data in the Form
		$scope.newEndDate = "";				
		$scope.newPrice = "";
		
		$scope.showUpdateConfirmMessage = false;						// close the Message window
		
		$scope.resetForm("updateCouponForm");						  	// reset the Update Coupon Form
	};
	
	/*
	 *********************
	 * 	 CLOSE BUTTONS	 *
	 ********************* 
	 *
	 * ----------------------------
	 * CLOSE ALL SELECTIONS BUTTON
	 * ----------------------------
	 */
	// CLOSE all the inside-show-windows in the Purchased Coupon Window
	$scope.closeShowCoupons=function(){
		
		// company coupons show-windows
		$scope.showAllCoupons=false;
		$scope.showCouponTitleList=false;
		$scope.showCompCouponByTitle=false;
		$scope.showCouponPrices=false;
		$scope.showPriceList=false;
		$scope.showCompCouponByPrice=false;
		$scope.showCouponDates=false;
		$scope.showDatePicker=false;
		$scope.showCompCouponByDate=false;
		// EDIT COUPONS show-windows 
		$scope.showIdToRemove = false;
		$scope.showIdToUpdate = false;
		$scope.showUpdateForm = false;
		// ERROR MESSAGES - SHOW Coupons show-windows 
		$scope.showNoCouponsErrorMessage=false;
		$scope.showAllCouponsErrorMessage=false;
		$scope.showByTitleErrorMessage=false;
		$scope.showByPriceErrorMessage=false;
		$scope.showListByPriceErrorMessage=false;
		$scope.showByDateErrorMessage=false;
		$scope.showListByDateErrorMessage=false;
		// CONFIRM MESSAGE show-window
		$scope.showRemoveConfirmMessage=false;
		$scope.showUpdateConfirmMessage=false;
		$scope.showExitMessage=false;
	};
	
	/*
	 * -------------------------
	 * BACK TO MAIN MENU BUTTON
	 * -------------------------
	 */
	// CLOSE the Show Coupon Window and open the Main Menu window
	$scope.backToMainMenu=function(){
		
		// close the "show coupons" window
		$scope.closeShowCoupons();										// close all the inside-show-windows			
			$scope.showCompCoupons=false;								// close the Show Coupon Window
		
		// close the "edit customers" window
		$scope.showAddCouponForm=false;									// close the Add Coupon Form Window
		$scope.showUpadteForm=false;									// close the Update Form Window
			$scope.showEditCoupon=false;								// close the EDIT Coupon Window
			
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
		$http.get("rest/company/exit").success(function(response) { $scope.exitMessage = response;});
		$scope.showWelcomeMessage = false;								// close the welcome message
		$scope.showExitMessage = true;									// open the goodbye message
		
		$timeout (function(){$window.location.href = 'http://localhost:8080/CouponProject/login.html';}, 1500);
	};
});

