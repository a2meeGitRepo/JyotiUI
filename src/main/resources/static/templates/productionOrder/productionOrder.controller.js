/**
 * @author : Anurag
 * @name : modelPlanController
 * @description : controller for Model Plan Module
 * @date : 10/07/2019
 */

(function () {
	"use strict";

	angular
		.module("myApp.productionOrder")
		.controller("ProductionOrderController", ProductionOrderController);

	ProductionOrderController.$inject = [
		"$scope",
		"$rootScope",
		"toastr",
		"genericFactory",
		"localStorageService",
		"ApiEndpoint"
	];

	/* @ngInject */
	function ProductionOrderController(
		$scope,
		$rootScope,
		toastr,
		genericFactory,
		localStorageService,
		ApiEndpoint
	) {
		
		var proOrderUrl = staticUrl + '/proOrder';

		$rootScope.loader=false;

		var vm = angular.extend(this, {
			selectAllChk: false,
			perPage : 10,
			total_count:0,
			pageno:1,
			pageChanged:pageChanged,
		});

		
		// current page
		$scope.pagination = {
		        current: 1
		    };
		
		// page changed 
		function pageChanged (pageNo) {
			console.log("Page No ::"+pageNo)
			vm.pageno=pageNo;
			loadPurchaseOrders();
			
		}
		
		
		function loadTotalCount(){
			var msg = "";

			var url=proOrderUrl+"/getTotalPOCount";;
		console.log("URL "+url)
			genericFactory.getAll(msg,url).then(function(response) {
				vm.total_count = response.data;
				console.log("count::  "+vm.total_count)
				
			});
		}
		
		
		$scope.isLoading = false;
		var init=function (){
		
			loadPurchaseOrders();
		}
		init();
		function loadPurchaseOrders(){
			loadTotalCount()
			//$rootScope.loader=true;
			var msg = "Items Loaded";
			var url =
				proOrderUrl +"/getProductionOrdersByPagination/"+vm.pageno+"/"+vm.perPage; 
		
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.prodOrders=response.data
				
				console.log("ProdOrders :: "+JSON.stringify($scope.prodOrders))
				$rootScope.loader=false;
			})
		}
		
		
		$scope.modify=function (index){
			$scope.prodOrders[index].edit=true
		}
		$scope.update=function (index,arr){
			$scope.isLoading = true;
			$scope.prodOrders[index]=arr
			
			var msg = "Production order updated ";
			var url =
				proOrderUrl +
				"/updateProductionOrder" ;
			console.log("ITEMS :: "+JSON.stringify(arr))
			genericFactory.add(msg, url,arr).then(function (response) {
				$scope.prodOrders[index].edit=false
				
				$rootScope.loader=false;
				
			})
		}
		$scope.changeStatus=function (index){
			$rootScope.loader=true;
			var msg = "Production order updated ";
			var url =
				proOrderUrl +
				"/updateStatusProductionOrder" ;
		
			genericFactory.add(msg, url,$scope.prodOrders[index]).then(function (response) {
				$scope.prodOrders[index].edit=false
				init();
				
			})
		}
		
	}
})();
