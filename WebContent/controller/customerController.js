/**
 * 	Customer Page Controller	
 */
//angular.module('couponSystem', ['ngMaterial']);
var app = angular.module('couponSystem', []);
	
	app.controller('custCtrl', function($scope, $http, $window, $timeout) {
	
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
	
	//--------------------------------
	// PURCHASED COUPONS show-windows
	//--------------------------------
	// SHOW PURCHASED COUPONS show-windows
	$scope.showPurchasedCoupons=false;
	$scope.showAllPurchasedCoupons=false;
	$scope.oneCoupon = false;											// ng-hide: open the Sort Arrows in the table's titles
	$scope.showPurchasedCouponTitleList=false;
	$scope.showCustCouponByTitle=false;
	$scope.showCustCouponTypes=false;
	$scope.showPurchasedCouponTypeList=false;
	$scope.showCustCouponByType=false;
	$scope.showCustCouponPrices=false;
	$scope.showPriceList=false;
	$scope.showCustCouponByPrice=false;
	// ERROR MESSAGES - PURCHASED coupons show-windows 
	$scope.showPurchasedErrorMessage=false;
	$scope.showAllPurchasedErrorMessage=false;
	$scope.showByTitlePurchasedErrorMessage=false;
	$scope.showByTypePurchasedErrorMessage=false;
	$scope.showByPricePurchasedErrorMessage=false;
	$scope.showPurchasedListByPriceErrorMessage=false;
	
	//---------------------------------------
	// BUY COUPONS show-windows (for buying)
	//---------------------------------------
	// SHOW NOT-PURCHASED COUPONS show-windows 
	$scope.showBuyCoupons=false;
	$scope.showNotPurchasedCoupons=false;
	$scope.showOtherCouponTypes=false;
	$scope.showNotPurchasedCouponTypeList=false;
	$scope.showOtherCouponByType=false;
	$scope.showOtherCouponPrices=false;
	$scope.showOtherPriceList=false;
	$scope.showOtherCouponByPrice=false;
	$scope.showOtherCouponDates=false;
	$scope.showDatePicker=false;
	$scope.showOtherCouponByDate=false;
	$scope.showPurchaseMessage=false;
	// ERROR MESSAGES - NOT-Purchased coupons show-windows
	$scope.showNotPurchasedErrorMessage=false;
	$scope.showBuyErrorMessage=false;
	$scope.showBuyByTypeErrorMessage=false;
	$scope.showBuyByPriceErrorMessage=false;
	$scope.showBuyListByPriceErrorMessage=false;
	$scope.showBuyByDateErrorMessage=false;
	$scope.showBuyListByDateErrorMessage=false;
	
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
	$scope.purchasedErrorMessage = "Sorry, you don't have any coupons yet!";
	$scope.notPurchasedErrorMessage = "Sorry, we are out of Coupons for you!";
	
	//-------------------------------------
	// define Objects and Arrays VARIABLES
	//-------------------------------------
	$scope.custCoupons = null;						
	$scope.otherCoupons = null;											
	$scope.interval = 50.0;												// set the range between the prices in the Price List
	
	//-----------------
	// START-UP ACTION
	//-----------------
	// start-up: get the Logged in Customer Name
	$http.get("rest/customer/getCustName").success(function(response) { $scope.custName = response;});
	
	$timeout (function(){
		
		if ($scope.custName == null)	$scope.showSQLErrorMessage=true;	// if there is no Customer Object - open the SQL ERROR window		
		
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
	 *  GET CUSTOMER
	 *---------------
	 */
	// get the logged in customer from the DB and its list of Coupons
	var getCustomer = function(other){
		
		// if "other = true" - get also the Not-Purchased coupons of the customer
		$http.get("rest/customer/getCustomer?other=" + other).success(function(response) { $scope.customer = response;});
		
	};
	
	/*
	 *-----------------------------------------------
	 *  CONVERT THE COUPON'S COLLECTIONS TO AN ARRAY 
	 *-----------------------------------------------
	 */ 
	// convert the coupons collections in the Customer Model to an Array 
	var getCouponsArray = function(other){
	
		var coupons = null;
	
		if ($scope.customer != null){
			
			if(other)
				coupons = $scope.customer.notPurchasedCoupons;		// get the update Not-Purchased Coupons List from the database
			
			else 
				coupons = $scope.customer.coupons;					// get the update Purchased Coupons List from the database
			
			console.log("getCouponsArray: coupons = " + coupons);
			
			if (coupons != null){									// check if there are any coupons in the list
				
				coupons = setCouponsList(coupons)					// force the coupons list to be an array and without NULL fields
				
			}
		}
		
		if(other)			$scope.otherCoupons = coupons;
		else				$scope.custCoupons = coupons;
		
		return coupons;												// return the Coupons List
	
	};
	
	//*******************************************************************************************************************************************//
	//						Button 1 :		S H O W    C U S T O M E R'S    P U R C H A S E D    C O U P O N  S      W I N D O W	  			 //
	//*******************************************************************************************************************************************//
	/*
	 *----------------------------------------
	 * SHOW CUSTOMER'S PURCHASED COUPONS MENU
	 *----------------------------------------
	 */
	// open the page of the "Show My Coupons" button
	$scope.showCustCoupons = function(){
		
		// get the update Customer model with its update collections of coupons from the database
		getCustomer(false);
		
		$timeout (function(){
			
			if ($scope.customer != null){
				
				$scope.showSQLErrorMessage=false;					// close the SQL ERROR window
				$scope.showMainMenu=false;							// close the Main Menu window
				$scope.showBuyCoupons=false;						// close the Buy Coupons window
				$scope.showHeaderMenu=true;							// open the back Menu in the header
				
				$scope.showPurchasedCoupons=true;					// open the Customer's Purchased Coupons window
				
				if (getCouponsArray(false) != null){				// check if the customer has any coupons
					
					console.log("custCoupons = " + $scope.custCoupons);
					defineCouponTable();							// define sorting method of the rows and columns in the Coupons Table
					
					$scope.showPurchasedCouponsMenu=true;			// open the Purchased Coupons Menu window
					$scope.showPurchasedErrorMessage=false;			// close the ERROR window
					
				}
				
				else{												// NO COUPONS
					
					$scope.custCoupons = null;
					$scope.showPurchasedErrorMessage=true;			// open the ERROR window
					$scope.showPurchasedCouponsMenu=false;			// close the Purchased Coupons Menu window
				}
			}
			
			else	$scope.showSQLErrorMessage=true;				// open the SQL ERROR window
			
		}, 100);
		
	};
	
	/*
	 *----------------------------
	 * SHOW ALL PURCHASED COUPONS
	 *----------------------------
	 */ 
	// SHOW ALL purchased coupons
	$scope.getAllCustCoupons=function(){
		
		if($scope.showAllPurchasedCoupons==false){
			
			if (getCouponsArray(false) != null){					// check if the customer has any coupons
				
				if ($scope.custCoupons.length == 1){ 				// if there is only one coupon in the list - we don't need the Sort Arrow
					
					$scope.oneCoupon = true;						// hide the Sort Arrows from the table's titles
					
				}else	$scope.oneCoupon = false;					// open the Sort Arrows in the table's titles
				
				$scope.showAllPurchasedCoupons=true;				// open the SHOW ALL Purchased Coupons window
				$scope.showAllPurchasedErrorMessage=false;			// close the ERROR window
			}
			
			else{													// NO COUPONS
				
				$scope.custCoupons = null;
				$scope.showAllPurchasedErrorMessage=true;			// open the ERROR window
			}
		}
		
		else 	$scope.showAllPurchasedCoupons=false;				// close the SHOW ALL Purchased Coupons window
	};
	
	/*
	 *--------------------------------
	 * SHOW PURCHASED COUPONS BY TITLE
	 *--------------------------------
	 */ 
	// SHOW the TITLE's LIST of all the purchased coupons
	$scope.getCustCouponTitleList=function(){
		
		if($scope.showCustCouponByTitle==false){
			
			if (getCouponsArray(false) != null){					// check if the customer has any coupons
				
				$scope.showByTitlePurchasedErrorMessage=false;		// close the ERROR window
				
				if ($scope.custCoupons.length == 1){ 				// if there is only one coupon in the list - don't open the TITLE list
					
					var coupon = $scope.customer.coupons;
					$scope.selectedCouponTitle = coupon.title;
					$scope.getCustCouponByTitle();					// show the coupon table
					
				}else	$scope.showPurchasedCouponTitleList=true;	// open the TITLE list of ALL Purchased Coupons window
				
			}
			
			else{													// NO COUPONS
				
				$scope.custCoupons = null;
				$scope.showByTitlePurchasedErrorMessage=true;		// open the ERROR window
			}
		}
		
		else {
			$scope.showPurchasedCouponTitleList=false;				// close the TITLE list of ALL Purchased Coupons window	
			$scope.showCustCouponByTitle=false;						// close the window of the Coupon of the selected TITLE
		}
	};
	// SHOW A purchased coupon by TITLE
	$scope.getCustCouponByTitle=function(){	
		
		$scope.custCoupon = getCouponByTitle($scope.custCoupons,$scope.selectedCouponTitle);
		
		$scope.showCustCouponByTitle=true;							// open the window of the Coupon of the selected TITLE
	};
	
	/*
	 *--------------------------------
	 * SHOW PURCHASED COUPONS BY TYPE
	 *--------------------------------
	 */ 
	// SHOW the COUPON TYPES LIST of all the purchased coupons  
	$scope.getCustCouponTypesList=function(){
		
		if($scope.showCustCouponTypes==false){
			
			var typeList = $scope.customer.couponTypes;
			
			if (typeList != null){									// check if the customer has any coupons
				
				var coupons = $scope.customer.coupons;
				
				$scope.custCoupons = setCouponsList(coupons)		// force the coupons list to be an array and without NULL fields
				$scope.custCouponTypes = setArray(typeList);		// force the coupons Type's list to be an array
				
				$scope.showCustCouponTypes=true;					// open the select by TYPE window of ALL Purchased Coupons window
				$scope.showByTypePurchasedErrorMessage=false;		// close the ERROR window
				
				if ($scope.custCouponTypes.length == 1){ 			// if there is only one coupon type in the list - don't open the TYPE list
					
					$scope.showPurchasedCouponTypeList=false;		// close the Type list of ALL Purchased Coupons window
					
					$scope.selectedType = typeList;					// set the type to the only one that is on the type list
					$scope.oneCoupon = true;						// hide the Sort Arrow from the table's titles
					$scope.getCustCouponsByType();					// show the coupon table
				}
				
				else {
					// get the List of the Coupon Types of all the purchased coupons
					$scope.custCouponTypes = getCouponTypes($scope.custCoupons,typeList);
					$scope.oneCoupon = false;						// open the Sort Arrow in the table's titles
					
					$scope.showPurchasedCouponTypeList=true;		// open the Type list of ALL Purchased Coupons window
				}
			}
			
			else {													// NO COUPONS
				
				$scope.custCoupons = null;
				$scope.showByTypePurchasedErrorMessage=true;		// open the ERROR window
			}
		}
		
		else {
			
			$scope.showCustCouponByType=false;						// close the window of the list of Customer Coupons of the selected Type 
			$scope.showPurchasedCouponTypeList=false;				// close the Type list of ALL Purchased Coupons window
			$scope.showCustCouponTypes=false;						// close the select by TYPE window of ALL Purchased Coupons window
		}
	};
	// SHOW purchased coupons by TYPE
	$scope.getCustCouponsByType=function(){
		// get the list of all the Purchased Coupons of a selected Type
		var coupons = $scope.custCoupons;
		var type = $scope.selectedType;
		$scope.purchasedByType = getCouponsByType(coupons,type);
		
		$scope.showCustCouponByType=true;							// open the window of the list of Coupons of the selected Type 
	};
	
	/*
	 *---------------------------------
	 * SHOW PURCHASED COUPONS BY PRICE
	 *---------------------------------
	 */ 
	// create a PRICE LIST 
	$scope.getPricesList=function(){
		
		if($scope.showCustCouponPrices==false){
			
			if (getCouponsArray(false) != null){					// check if the customer has any coupons
			
				$scope.showCustCouponPrices=true;					// open the select by PRICE Range window of ALL Purchased Coupons window
				$scope.showByPricePurchasedErrorMessage=false;		// close the ERROR window
				
				if ($scope.custCoupons.length == 1){ 				// if there is only one coupon in the list - don't open the PRICE Range list
					
					$scope.showPriceList=false;						// close the Price list of ALL Purchased Coupons window
					
					var coupon = $scope.customer.coupons;
					$scope.selectedPrice = coupon.price;				
					$scope.getCustCouponsByPrice();					// show the coupon table
				}
				
				else {
					// get the Price Range of the Customer purchased coupons
					var minPrice = $scope.customer.minPrice;
					var maxPrice = $scope.customer.maxPrice;
					$scope.priceList = createPricesList(minPrice, maxPrice);
					
					if ($scope.priceList.length == 1){ 					// if there is only one price-range in the price list - don't open the PRICE list
						
						$scope.showPriceList=false;						// close the Price list of ALL Purchased Coupons window
						$scope.selectedPrice = $scope.priceList[0].max;	// set the price to the only one that is on the price list
						$scope.oneCoupon = true;						// hide the Sort Arrow from the table's titles
						$scope.getCustCouponsByPrice();					// show the coupon table
					}
					
					else {
						
						$scope.showPriceList=true;						// open the Price list of ALL Purchased Coupons window
						$scope.oneCoupon = false;						// open the Sort Arrow in the table's titles
					}
				}
			}
			
			else {													// NO COUPONS
				
				$scope.custCoupons = null;
				$scope.showByPricePurchasedErrorMessage=true;		// open the ERROR window
				$scope.showCustCouponByPrice=false;					// close the window of the list of Customer Coupons of the selected Price Range
				$scope.showPriceList=false;							// close the Price Range list of ALL Purchased Coupons window
			}
		}
		
		else {
			
			$scope.showCustCouponByPrice=false;						// close the window of the list of Customer Coupons of the selected Price Range
			$scope.showPriceList=false;								// close the Price Range list of ALL Purchased Coupons window
			$scope.showCustCouponPrices=false;						// close the select by PRICE Range window of ALL Purchased Coupons window
		}
	};
	// show purchased coupons by PRICE
	$scope.getCustCouponsByPrice=function(){
		// get the list of all the Purchased Coupons of the selected Price Range
		var coupons = $scope.custCoupons;
		var price = $scope.selectedPrice;
		$scope.purchasedByPrice = getCouponsByPrice(coupons,price);
		
		$timeout (function(){
			
			var list = $scope.purchasedByPrice;
			
			if (list != ""){										// check if the customer has any coupons of the selected price range
				
				$scope.showCustCouponByPrice=true;					// open the window of the list of Coupons of the selected price range 
				$scope.showPurchasedListByPriceErrorMessage=false;	// close the ERROR window
			}
			
			else{													// NO COUPONS
				
				$scope.showPurchasedListByPriceErrorMessage=true;	// open the ERROR window
				$scope.showCustCouponByPrice=false;					// close the window of the list of Coupons of the selected price range
			}
			
		}, 100);
	};
	
	//*******************************************************************************************************************************************//
	//										Button 2 :		B U Y      N E W    C O U P O N  S      W I N D O W	  								 //
	//*******************************************************************************************************************************************//
	/*
	 *-----------------------
	 * SHOW BUY COUPONS MENU
	 *-----------------------
	 */
	// open the page of the "Buy New Coupons" button
	$scope.buyCoupons = function(){
		
		// get the update Customer model with its update collections of Not-Purchased coupons from the database
		getCustomer(true);											
		
		$timeout (function(){
			
			if ($scope.customer != null){
				
				$scope.showMainMenu=false;							// close the Main Menu window
				$scope.showPurchasedCoupons=false;					// close the Customer Purchased Coupons window
				
				$scope.showBuyCoupons=true;							// open the Buy Coupons window
				
				if (getCouponsArray(true) != null){					// check if there are any coupons left to purchase
					
					console.log("otherCoupons = " + $scope.otherCoupons);
					defineCouponTable();							// define sorting method of the rows and columns in the Coupons Table
					
					$scope.showNotPurchasedCouponsMenu=true;		// open the Buy Coupons Menu window
					$scope.showNotPurchasedErrorMessage=false;		// close the ERROR window
					
				}
				
				else{												// NO COUPONS
					
					$scope.otherCoupons = null;
					$scope.showNotPurchasedErrorMessage=true;		// open the ERROR window
					$scope.showNotPurchasedCouponsMenu=false;		// close the Buy Coupons Menu window
				}
			}
			
			else	$scope.showSQLErrorMessage=true;				// open the SQL ERROR window
			
		}, 100);
		
	};
	
	/*
	 *--------------------------------
	 * SHOW ALL NOT-PURCHASED COUPONS
	 *--------------------------------
	 */
	// SHOW ALL Not-Purchased coupons
	$scope.getAllOtherCoupons=function(){
		
		if($scope.showNotPurchasedCoupons==false){
			
			// get the update Customer model with its update collections of Not-Purchased coupons from the database
			getCustomer(true);
			
			$timeout (function(){
				
				if ($scope.customer != null){
					
					$scope.showPurchaseMessage=false;					// close the Purchase Message window
					
					if (getCouponsArray(true) != null){					// check if there are any coupons left to purchase
						
						if ($scope.otherCoupons.length == 1){ 			// if there is only one coupon in the list - we don't need the Sort Arrow
							
							$scope.oneCoupon = true;					// hide the Sort Arrow from the table's titles
							
						}else	$scope.oneCoupon = false;				// open the Sort Arrows in the table's titles
						
						$scope.showNotPurchasedCoupons=true;			// open the SHOW ALL NOT-Purchased Coupons window
						$scope.showBuyErrorMessage=false;				// close the ERROR window
					}
					
					else{												// NO COUPONS
						
						$scope.otherCoupons = null;
						$scope.showBuyErrorMessage=true;				// open the ERROR window
					}
				}
			
				else	$scope.showSQLErrorMessage=true;				// open the SQL ERROR window
				
			}, 100);
		}
		
		else 	$scope.showNotPurchasedCoupons=false;					// close the SHOW ALL Not-Purchased Coupons window
		
	};
	
	/*
	 *------------------------------------
	 * SHOW NOT-PURCHASED COUPONS BY TYPE
	 *------------------------------------
	 */
	// SHOW the COUPON TYPES LIST of all the Not-purchased coupons  
	$scope.getOtherCouponTypesList=function(){
		
		
		if ($scope.showOtherCouponTypes==false){
			
			// get the update Customer model with its update collections of Not-Purchased coupons from the database
			getCustomer(true);
			
			$timeout (function(){
				
				if ($scope.customer != null){
					
					$scope.showPurchaseMessage=false;						// close the Purchase Message window
					
					var typeList = $scope.customer.notPurchasedCouponTypes;
					var coupons = $scope.customer.notPurchasedCoupons;
					
					if (typeList != null){									// check if there are any coupons left to purchase
						
						//$scope.otherCoupons = getCouponsArray(true);
						
						$scope.custCoupons = setCouponsList(coupons)		// force the coupons list to be an array and without NULL fields
						$scope.custCouponTypes = setArray(typeList);		// force the coupons Type's list to be an array
						
						$scope.showOtherCouponTypes=true;					// open the select by TYPE window of ALL Not-Purchased Coupons window
						$scope.showBuyByTypeErrorMessage=false;				// close the ERROR window
						
						if ($scope.otherCouponTypes.length == 1){ 			// if there is only one coupon type in the list - don't open the TYPE list
							
							$scope.showNotPurchasedCouponTypeList=false;	// close the Type list of ALL Not-Purchased Coupons window
							
							$scope.selectedType = typeList;					// set the type to the only one that is on the type list
							$scope.oneCoupon = true;						// hide the Sort Arrows from the table's titles
							$scope.getOtherCouponsByType();					// show the coupon table
						}
						
						else {
							// get the List of the Coupon Types of all the Not-purchased coupons
							coupons = $scope.otherCoupons;
							$scope.otherCouponTypes = getCouponTypes(coupons,typeList);
							$scope.showNotPurchasedCouponTypeList=true;		// open the Type list of ALL Purchased Coupons window
							$scope.oneCoupon = false;						// open the Sort Arrows in the table's titles
						}
					}
					
					else {													// NO COUPONS
						
						$scope.otherCoupons = null;
						$scope.showBuyByTypeErrorMessage=true;				// open the ERROR window
					}
				}
				
				else	$scope.showSQLErrorMessage=true;					// open the SQL ERROR window
				
			}, 100);
		}

		else {
			
			$scope.showOtherCouponByType=false;								// close the window of the list of Customer Not-Purchased Coupons of the selected Type 
			$scope.showNotPurchasedCouponTypeList=false;					// close the Type list of ALL Not-Purchased Coupons window
			$scope.showOtherCouponTypes=false;								// close the select by TYPE window of ALL Not-Purchased Coupons window
		}
	};
	// SHOW Not-purchased coupons by TYPE
	$scope.getOtherCouponsByType=function(){
		// get the list of all the Not-Purchased Coupons of a selected Type
		var coupons = $scope.otherCoupons;
		var type = $scope.selectedType;
		$scope.notPurchasedByType = getCouponsByType(coupons,type);
		
		$scope.showOtherCouponByType=true;									// open the window of the list of Not-purchased Coupons of the selected Type 
	};
	
	/*
	 *-------------------------------------
	 * SHOW NOT-PURCHASED COUPONS BY PRICE
	 *-------------------------------------
	 */
	// create a PRICE LIST 
	$scope.getOtherPricesList=function(){
		
		if($scope.showOtherCouponPrices==false){
			
			// get the update Customer model with its update collections of Not-Purchased coupons from the database
			getCustomer(true);
			
			$timeout (function(){
				
				if ($scope.customer != null){
					
					$scope.showPurchaseMessage=false;									// close the Purchase Message window
					
					if (getCouponsArray(true) != null){									// check if there are any coupons left to purchase
						
						$scope.showHeaderMenu=true;										// open the side menu in the header
						$scope.showOtherCouponPrices=true;								// open the select by PRICE Range window of ALL Not-Purchased Coupons window
						$scope.showBuyByPriceErrorMessage=false;						// close the ERROR window
						
						if ($scope.otherCoupons.length == 1){ 							// if there is only one coupon in the list - don't open the PRICE Range list
							
							$scope.showOtherPriceList=false;							// close the Price list of ALL Not-Purchased Coupons window
							
							var coupon = $scope.customer.notPurchasedCoupons;
							$scope.selectedCouponPrice = coupon.price;	
							$scope.oneCoupon = true;									// hide the Sort Arrows from the table's titles
							$scope.getOtherCouponsByPrice();							// show the coupon table
						}
						
						else {
							// get the Price Range of the Customer purchased coupons
							var minPrice = $scope.customer.minPriceNPC;
							var maxPrice = $scope.customer.maxPriceNPC;
							$scope.otherPriceList = createPricesList(minPrice, maxPrice);
							$scope.oneCoupon = false;									// open the Sort Arrows in the table's titles
							
							if ($scope.otherPriceList.length == 1){ 					// if there is only one price-range in the price list - don't open the PRICE list
								
								$scope.showOtherPriceList=false;						// close the Price list of ALL Not-Purchased Coupons window
								
								$scope.selectedPrice = $scope.otherPriceList[0].max;	// set the price to the only one that is on the price list
								$scope.getOtherCouponsByPrice();						// show the coupon table
							}
							
							else	$scope.showOtherPriceList=true;						// open the Price list of ALL Purchased Coupons window
							
						}
					}
					
					else {												// NO COUPONS
						
						$scope.otherCoupons = null;
						$scope.showBuyByPriceErrorMessage=true;			// open the ERROR window
					}
				}
				
				else	$scope.showSQLErrorMessage=true;				// open the SQL ERROR window
				
			}, 100);
		}
		
		else {
			
			$scope.showOtherCouponByPrice=false;						// close the window of the list of Customer Not-Purchased Coupons of the selected Price Range
			$scope.showOtherPriceList=false;							// close the Price Range list of ALL Not-Purchased Coupons window
			$scope.showOtherCouponPrices=false;							// close the select by PRICE Range window of ALL Not-Purchased Coupons window
		}	
	};
	// show Not-purchased coupons by PRICE
	$scope.getOtherCouponsByPrice=function(){
		// get the list of all the Not-Purchased Coupons of the selected Price Range
		var coupons = $scope.otherCoupons;
		var price = $scope.selectedPrice;
		
		$scope.notPurchasedByPrice = getCouponsByPrice(coupons,price);
		
		$timeout (function(){
			
			var list = $scope.notPurchasedByPrice;
			
			if (list != ""){											// check if there are any coupons left to purchase of the selected price range
				
				$scope.showOtherCouponByPrice=true;						// open the window of the list of Not-Purchased Coupons of the selected price range 
				$scope.showBuyListByPriceErrorMessage=false;			// close the ERROR window
			}
			
			else{														// NO COUPONS
				
				$scope.showBuyListByPriceErrorMessage=true;				// open the ERROR window
				$scope.showOtherCouponByPrice=false;					// close the window of the list of Not-Purchased Coupons of the selected price range
			}
			
		}, 100);
	};
	
	/*
	 *--------------------------------------------
	 * SHOW NOT-PURCHASED COUPONS BY EXPIRED DATE
	 *--------------------------------------------
	 */
	// open the Date Picker to choose a maximum End Date
	$scope.openDatePicker=function(){
		
		// init the default value to be TODAY
		$scope.today = new Date();
		
		if($scope.showOtherCouponDates==false){
			
			// get the update Customer model with its update collections of Not-Purchased coupons from the database
			getCustomer(true);
			
			$timeout (function(){
				
				if ($scope.customer != null){
					
				$scope.showPurchaseMessage=false;						// close the Purchase Message window
					
					if (getCouponsArray(true) != null){					// check if there are any coupons left to purchase
						
						$scope.showOtherCouponDates=true;				// open the select by Date window of ALL Not-Purchased Coupons window
						$scope.showBuyByDateErrorMessage=false;			// close the ERROR window
						
						if ($scope.otherCoupons.length == 1){ 			// if there is only one coupon in the list - don't open the Date picker
							
							$scope.showDatePicker=false;				// close the Date Picker window
							
							var coupon = $scope.customer.notPurchasedCoupons;
							$scope.inputDate = coupon.endDate;
							$scope.oneCoupon = true;					// hide the Sort Arrows from the table's titles
							$scope.getOtherCouponsByDate();				// show the coupon table
						}
						
						else {
							
							$scope.showDatePicker=true;					// open the Date Picker window
							$scope.oneCoupon = false;					// open the Sort Arrows in the table's titles
						}
						
					}
					
					else {												// NO COUPONS
						
						$scope.otherCoupons = null;
						$scope.showBuyListByDateErrorMessage=true;		// open the ERROR window
					}
				}
				
				else	$scope.showSQLErrorMessage=true;				// open the SQL ERROR window
				
			}, 100);
		}
		
		else {
			
			$scope.showOtherCouponByDate=false;							// close the window of the list of Customer Not-Purchased Coupons of the selected End Date
			$scope.showDatePicker=false;								// close the Date Picker window
			$scope.showOtherCouponDates=false;							// close the window of the list of Coupons of the selected End Date
		}	
	};
	// show Not-purchased coupons by END DATE
	$scope.getOtherCouponsByDate=function(){
		// get the list of all the Not-Purchased Coupons of the selected End Date
		var coupons = $scope.otherCoupons;
		var maxDate = new Date($scope.inputDate);
		$scope.notPurchasedByDate = new Array();
		
		for (i=0; i<coupons.length; i++){
			
			var endDate = new Date(coupons[i].endDate);
			if (endDate <= maxDate)			$scope.notPurchasedByDate.push(coupons[i]);
			
		}
		
		$timeout (function(){
			
			var list = $scope.notPurchasedByDate;
			
			if (list != ""){										// check if there are any coupons left to purchase of the selected end date
				
				$scope.showOtherCouponByDate=true;					// open the window of the list of Not-Purchased Coupons of the selected price range 
				$scope.showBuyListByDateErrorMessage=false;			// close the ERROR window
			}
			
			else{													// NO COUPONS
				
				$scope.showBuyListByDateErrorMessage=true;			// open the ERROR window
				$scope.showOtherCouponByDate=false;					// close the window of the list of Not-Purchased Coupons of the selected end date
			}
			
		}, 100);
	};
	
	/*
	 *-----------------------
	 * PURCHASE A NEW COUPON
	 *-----------------------
	 */
	// PURCHASE the selected Coupon 
	$scope.purchase = function(id){
		
		$scope.showPurchaseMessage=false;								// close the Purchase Message window
		
		var confirmBuy = confirm("are you sure that you want to purchase this coupon?\n the price is: " + getCouponById($scope.otherCoupons,id).price + " NIS");
		
		if (confirmBuy){
			
			$http.get("rest/customer/purchaseCoupon?coupId=" + id).success(function(response) { $scope.purchaseMessage = response;});
			
			$scope.showPurchaseMessage=true;							// open the Purchase Message window
				
			// refresh the Not-Purchased window after buying a new coupon
			$timeout (function(){
				
				$scope.showPurchaseMessage=false;						// close the Purchase Message window
				$scope.refreshBuy();									// refresh the open inside-windows	
				
			}, 2500);
		}
	};
	
	//*******************************************************************************************************************************************//
	//												G E N E R A L(SHARED)   F U N C T I O N S			 		  		 						 //
	//*******************************************************************************************************************************************//
	/*
	 *-------------------
	 *  GET COUPON BY ID
	 *-------------------
	 */ 
	// Get coupon (Purchased or Not-Purchased) by its ID
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
	// Get coupon (Purchased or Not-Purchased) by its TITLE
	var getCouponByTitle=function(list,title){	
		console.log("getCouponByTitle: list = " + list + "; title = " + title);
		for (i=0;i<list.length;i++){
			
			if (list[i].title === title)		var coupon = list[i];
		}
		console.log("getCouponByTitle: coupon = " + coupon);
		return coupon;
	};
	
	/*
	*---------------------------
	*  DEFINE THE COUPONS TABLE 
	*---------------------------
	*/  
	// define the rows and columns in the Coupons Table
	//var defineCouponTable=function(list){
	var defineCouponTable=function(){
		
		$scope.sort = {
				type: 'id',
				reverse: false
		};
		//$scope.searchData = '';
		//$scope.rows = list;
		//$scope.cols = Object.keys($scope.rows[0]);
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
		console.log("setCouponsList: coupons = " + coupons);
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
	// get a list of all Coupon's Types of the Customer Purchased or Not-Purchased Coupons list
	var getCouponTypes = function(coupons,types){
		
		var couponTypes = [];
		
		if (coupons.length > 1){
			
			angular.forEach(types, function (value,key) {
				
				couponTypes.push(value);
			});
			
		}else{
			// converting custCoupons to an Array even if it has only one object in it
			couponTypes.push(types);
		}
			
		return couponTypes;
	};
	
	/*
	 *----------------------
	 *  GET COUPONS BY TYPE
	 *----------------------
	 */ 
	// get a list of coupons by selected TYPE
	var getCouponsByType=function(coupons,type){
		
		var couponsByType = new Array(); 
			
		for (i=0; i<coupons.length; i++){
			
			if (coupons[i].type == type)		couponsByType.push(coupons[i]);
		}
		
		return couponsByType;
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
	
	//*******************************************************************************************************************************************//
	//											R E F R E S H / C L O S E / E X I T     B U T T O N S	  		 								 //
	//*******************************************************************************************************************************************//
	/*
	 ********************
	 * 	REFRESH BUTTON  *
	 ********************
	 *
	 *------------------------------------
	 *  REFRESH "PURCHASE COUPONS" WINDOW
	 *------------------------------------
	 */  
	// REFRESH the show Purchased Coupon Window - close the open inside windows, update information from the DataBase and re-open the inside windows
	$scope.refreshPurchased=function(){
		
		var all;
		var titleList;
		var couponByTitle;
		var typeList;
		var couponsByType;
		var priceList;
		var couponsByPrice;
		
		// close all the open inside-show-windows
		if ($scope.showPurchasedCoupons == true){
			$scope.showPurchasedCoupons=false;
		}
		if ($scope.showAllPurchasedCoupons == true){
			all = true;
			$scope.showAllPurchasedCoupons=false;
		}
		if ($scope.showPurchasedCouponTitleList==true){
			titleList = true;
			$scope.showPurchasedCouponTitleList=false;
		}
		if ($scope.showCustCouponByTitle == true){
			couponByTitle = true;
			$scope.showCustCouponByTitle=false;
		}
		if ($scope.showCustCouponTypes == true){
			typeList = true;
			$scope.showCustCouponTypes=false;
		}
		if ($scope.showCustCouponByType == true){
			couponsByType = true;
			$scope.showCustCouponByType=false;
		}
		if ($scope.showCustCouponPrices == true){
			priceList = true;
			$scope.showCustCouponPrices=false;
		}
		if ($scope.showCustCouponByPrice == true){
			couponsByPrice = true;
			$scope.showCustCouponByPrice=false;
		}
		
		// updating the customer from the DataBase
		$scope.showCustCoupons();
		
		$timeout (function(){													// waiting so the coupons list will be updated
			
			var coupons = $scope.custCoupons;
			
			// re-open the inside-show-windows that were open before the refresh (calling again to the functions that create the data inside these windows)
			if (all == true){
				$scope.getAllCustCoupons();											// all purchased coupons list
				all = false;
			}
			if (titleList == true){
				$scope.getCustCouponTitleList()										// all purchased coupons TITLE list 
				titleList = false;
			}
			if (couponByTitle == true){
				$scope.getCustCouponByTitle();											// the selected coupon by TITLE
				couponByTitle = false;
			}
			
			if (typeList == true){
				$scope.getCustCouponTypesList();									// all purchased coupons TYPES list
				typeList = false;
			}
			// all purchased coupons list of the selected TYPE
			if (couponsByType == true){					
				// open the coupons details window only if there are any coupons left of the previous selected coupon TYPE
				var couponsByTypeList = 0;
				
				for(i=0;i<$scope.custCouponTypes.length;i++){
					
					if ($scope.custCouponTypes[i] == $scope.selectedType)		couponsByTypeList++ ;
				}
				
				if (couponsByTypeList != 0)		$scope.getCustCouponsByType();		// open the coupons details window	
				
				couponsByType = false;
			}
			
			if (priceList == true){
				$scope.getPricesList();					//	the PRICE RANGE list
				priceList = false;
			}
			// all purchased coupons list of the selected PRICE RANGE
			if (couponsByPrice == true){		
				// open the coupons details window only if there are any coupons left of the previous selected PRICE RANGE
				var couponsByPriceList = 0;
				
				for(i=0;i<$scope.priceList.length;i++){
					
					if ($scope.priceList[i].max <= $scope.selectedPrice && $scope.priceList[i].max > ($scope.selectedPrice - $scope.interval))
						
						couponsByPriceList++;
					
				}
				
				if (couponsByPriceList != 0)		$scope.getCustCouponsByPrice();		// open the coupons details window
				
				couponsByPrice = false;
			}
			
		}, 200);
	};
	
	/*
	 *-------------------------------
	 *  REFRESH "BUY COUPONS" WINDOW
	 *-------------------------------
	 */ 
	// REFRESH the Buy Coupons Window - close the open inside windows, update information from the DataBase and re-open the inside windows
	$scope.refreshBuy=function(){
		
		var all;
		var typeList;
		var couponsByType;
		var priceList;
		var couponsByPrice;
		var datePicker;
		var couponsByDate;
		
		// close all the open inside-show-windows
		if ($scope.showBuyCoupons == true){
			$scope.showBuyCoupons=false;
		}
		if ($scope.showNotPurchasedCoupons == true){
			all = true;
			$scope.showNotPurchasedCoupons=false;
		}
		if ($scope.showOtherCouponTypes == true){
			typeList = true;
			$scope.showOtherCouponTypes=false;
		}
		if ($scope.showOtherCouponByType == true){
			couponsByType = true;
			$scope.showOtherCouponByType=false;
		}
		if ($scope.showOtherCouponPrices == true){
			priceList = true;
			$scope.showOtherCouponPrices=false;
		}
		if ($scope.showOtherCouponByPrice == true){
			couponsByPrice = true;
			$scope.showOtherCouponByPrice=false;
		}
		if ($scope.showOtherCouponDates == true){
			datePicker = true;
			$scope.showOtherCouponDates=false;
		}
		if ($scope.showOtherCouponByDate == true){
			couponsByDate = true;
			$scope.showOtherCouponByDate=false;
		}
		if ($scope.showPurchaseMessage == true){
			$scope.showPurchaseMessage=false;
		}
		
		// updating the customer from the DataBase
		$scope.buyCoupons();
		
		// updating the Not-purchased coupon list
		
		$timeout (function(){							// waiting so the coupons list will be updated
			
			var coupons = $scope.otherCoupons;
			
			// re-open the inside-show-windows that were open before the refresh (calling again to the functions that create the data inside these windows)
			if (all == true){
				$scope.getAllOtherCoupons();			// all Not-purchased coupons list
				all = false;
			}
			
			// by Coupons Type
			if (typeList == true){
				$scope.getOtherCouponTypesList();		// all Not-purchased coupons TYPES list
				typeList = false;
			}
			// all Not-purchased coupons list of the selected TYPE
			if (couponsByType == true){					
				// open the coupons details window only if there are any coupons left of the previous selected coupon TYPE
				var couponsByTypeList = 0;
				
				for(i=0;i<$scope.otherCouponTypes.length;i++){
					
					if ($scope.otherCouponTypes[i] == $scope.selectedType)		couponsByTypeList++ ;
																			
				}
				
				if (couponsByTypeList != 0)		$scope.getOtherCouponsByType();		// open the coupons details window	
				
				couponsByType = false;
			}
			
			// by Price Range
			if (priceList == true){
				$scope.getOtherPricesList();			//	the PRICE RANGE list
				priceList = false;
			}
			// all Not-purchased coupons list of the selected PRICE RANGE
			if (couponsByPrice == true){		
				// open the coupons details window only if there are any coupons left of the previous selected PRICE RANGE
				var couponsByPriceList = 0;
				
				for(i=0;i<$scope.otherPriceList.length;i++){
					
					if ($scope.otherPriceList[i].max <= $scope.selectedPrice && $scope.otherPriceList[i].max > ($scope.selectedPrice - $scope.interval))
						
						couponsByPriceList++;
					
				}
				
				if (couponsByPriceList != 0)		$scope.getOtherCouponsByPrice();		// open the coupons details window
				
				couponsByPrice = false;
			}
			
			// by Expired Date
			if (datePicker == true){
				$scope.openDatePicker();				//	open the Date Picker window
				datePicker = false;
			}
			// all Not-purchased coupons list of the selected EXPIRED DATE
			if (couponsByDate == true){	
				// open the coupons details window only if there are any coupons left of the the previous selected EXPIRED DATE
				var couponsByDateList = 0;
				var maxDate = new Date($scope.inputDate);
				
				for(i=0;i<coupons.length;i++){
					
					var endDate = new Date(coupons[i].endDate);
					
					if (endDate <= maxDate)			couponsByDateList++;
				}
				
				if (couponsByDateList != 0)			$scope.getOtherCouponsByDate();		// open the coupons details window
				
				couponsByDate = false;
			}
			
		}, 200);
	};
	
	/*
	 *********************
	 * 	 CLOSE BUTTONS	 *
	 ********************* 
	 *
	 * --------------------------------------------------------
	 * CLOSE ALL SELECTIONS BUTTON - CUSTOMER'S COUPONS WINDOW
	 * --------------------------------------------------------
	 */
	// CLOSE all the inside-show-windows in the Purchased Coupon Window
	$scope.closePurchasedMenu=function(){
		
		// close all the inside-show-windows
		$scope.showAllPurchasedCoupons=false;
		$scope.showPurchasedCouponTitleList=false;
		$scope.showCustCouponByTitle=false;
		$scope.showCustCouponTypes=false;
		$scope.showPurchasedCouponTypeList=false;
		$scope.showCustCouponByType=false;
		$scope.showCustCouponPrices=false;
		$scope.showPriceList=false;
		$scope.showCustCouponByPrice=false;
		// ERROR MESSAGES 
		$scope.showPurchasedErrorMessage=false;
		$scope.showAllPurchasedErrorMessage=false;
		$scope.showByTitlePurchasedErrorMessage=false;
		$scope.showByTypePurchasedErrorMessage=false;
		$scope.showByPricePurchasedErrorMessage=false;
		$scope.showPurchasedListByPriceErrorMessage=false;
		$scope.showExitMessage=false;
	};
	
	/*
	 * -------------------------------------------------
	 * CLOSE ALL SELECTIONS BUTTON - BUY COUPONS WINDOW
	 * -------------------------------------------------
	 */
	// CLOSE all the inside-show-windows in the BUY Coupons Window
	$scope.closeBuyCouponsMenu=function(){
		
		// close all the inside-show-windows
		$scope.showNotPurchasedCoupons=false;
		$scope.showotherCouponTypes=false;
		$scope.showNotPurchasedCouponTypeList=false;
		$scope.showOtherCouponByType=false;
		$scope.showotherCouponPrices=false;
		$scope.showOtherPriceList=false;
		$scope.showOtherCouponByPrice=false;
		$scope.showotherCouponDates=false;
		$scope.showDatePicker=false;
		$scope.showOtherCouponByDate=false;
		$scope.showPurchaseMessage=false;
		// ERROR MESSAGES
		$scope.showNotPurchasedErrorMessage=false;
		$scope.showBuyErrorMessage=false;
		$scope.showBuyByTypeErrorMessage=false;
		$scope.showBuyByPriceErrorMessage=false;
		$scope.showBuyListByPriceErrorMessage=false;
		$scope.showBuyByDateErrorMessage=false;
		$scope.showBuyListByDateErrorMessage=false;
		$scope.showExitMessage=false;
	};
	
	/*
	 * ----------------------------------------------
	 * BACK TO MAIN MENU BUTTON - BUY COUPONS WINDOW
	 * ----------------------------------------------
	 */
	// BACK TO MAIN MENU - CLOSE the Buy Coupon Window and open the Main Menu window
	$scope.backToMainMenu=function(){
		
		$scope.closePurchasedMenu();				// close all the Purchased Coupons's inside-show-windows			
			$scope.showPurchasedCoupons=false;		// close the "Show Purchased Coupon" Window
			
		$scope.closeBuyCouponsMenu();				// close all the Buy Coupons's inside-show-windows			
			$scope.showBuyCoupons=false;			// close the "Buy Coupons" Window
		
		$scope.showHeaderMenu=false;				// close the right Menu in the header
		$scope.showMainMenu=true;					// open the Main Menu window
	};
	
	/*
	 ****************************
	 * 	Button 3:  EXIT BUTTON  *
	 ****************************
	 */
	// EXIT the Customer Page back to the LOGIN page
	$scope.exit=function(){
		// closing the Coupon System 
		$http.get("rest/customer/exit").success(function(response) { $scope.exitMessage = response;});
		$scope.showWelcomeMessage = false;			// close the welcome message
		$scope.showExitMessage = true;				// open the goodbye message
		
		$timeout (function(){$window.location.href = 'http://localhost:8080/CouponProject/login.html';}, 1500);
	};
});

