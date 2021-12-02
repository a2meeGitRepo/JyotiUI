/**
 * @author : Anurag
 * @name : modelPlanController
 * @description : controller for Model Plan Module
 * @date : 10/07/2019
 */

(function () {
	"use strict";

	angular
		.module("myApp.modelPlan")
		.controller("SupplierAndItemsController", SupplierAndItemsController);

	SupplierAndItemsController.$inject = [
		"$scope",
		"toastr",
		"genericFactory",
		"localStorageService",
		"ApiEndpoint"
	];

	/* @ngInject */
	function SupplierAndItemsController(
		$scope,
		toastr,
		genericFactory,
		localStorageService,
		ApiEndpoint
	) {
		var suuplierUrl = staticUrl + "/suuplier";
		var itemUrl = staticUrl + '/items';

	

		var vm = angular.extend(this, {
			selectAllChk: false
		});
	
		
		var init = function (){
			var msg = "Model Master Load....', 'Successful !!";
			var url = suuplierUrl + "/getSupplierList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.suppliers = response.data;
				// console.log(JSON.stringify($scope.suppliers));
			});
		}
		var loadItems=function (){
			var msg = "Items Loaded";
			var url =
				itemUrl +
				"/itemList" ;
			$scope.isLoading = true;
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.items=response.data
				$scope.isLoading = true;
			//	console.log("Items :: "+JSON.stringify($scope.items))
			})
		}
		init();
		loadItems();
		$scope.getSupplierComponant=function (supplier){
			
			 var supp=JSON.parse(supplier) 
			  console.log(JSON.stringify(supp));
			 $scope.addButtonn=true
			var msg=""
		var url = suuplierUrl + "/getSupplierComponantsBySupplier?supplierId="+supp.supplierId;
			//console.log("url ::: "+url);
		genericFactory.getAll(msg, url).then(function (response) {
			$scope.supplierComponants = response.data;
			 console.log(JSON.stringify($scope.supplierComponants));
		});
	}
	

	$scope.addNew=function (){
		$scope.addNewTab=true
		loadItems()
	}
	
	$scope.addComponatnt=function(){
		console.log("selectedItem :: "+JSON.stringify($scope.selectedItem))
		console.log("supplier :: "+JSON.stringify($scope.supplier))
		var supplierCom={}
		supplierCom.supplier=JSON.parse($scope.supplier);
		supplierCom.itemMst=$scope.selectedItem
		supplierCom.active=1;
		supplierCom.addedDate=new Date();
		var msg = "Items addes";
		var url =
			suuplierUrl +
			"/addSupplierComponant" ;
		$scope.isLoading = true;
		genericFactory.add(msg, url,supplierCom).then(function (response) {
			$scope.items=response.data
			var url = suuplierUrl + "/getSupplierComponantsBySupplier?supplierId="+supplierCom.supplier.supplierId;
			//console.log("url ::: "+url);
		genericFactory.getAll(msg, url).then(function (response) {
			$scope.supplierComponants = response.data;
			 console.log(JSON.stringify($scope.supplierComponants));
		});
		})
		
	}
	$scope.check=function (){
		 console.log(JSON.stringify($scope.selectedItemForCheck))
		var msg=""
			var url = suuplierUrl + "/getSupplierComponantsByItem?itemId="+$scope.selectedItemForCheck.id;
				//console.log("url ::: "+url);
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.supplierComponants2 = response.data;
				 console.log(JSON.stringify($scope.supplierComponants2));
			});
	}
	
	
	}
})();
