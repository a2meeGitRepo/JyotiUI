/**
 * @author : Anurag
 * @name : modelPlanController
 * @description : controller for Model Plan Module
 * @date : 10/07/2019
 */

(function () {
	"use strict";

	angular
		.module("myApp.items")
		.controller("ItemsController", ItemsController);

	ItemsController.$inject = [
		"$scope",
		"toastr",
		"genericFactory",
		"localStorageService",
		"ApiEndpoint"
	];

	/* @ngInject */
	function ItemsController(
		$scope,
		toastr,
		genericFactory,
		localStorageService,
		ApiEndpoint
	) {
		
		var itemUrl = staticUrl + '/items';

		

		var vm = angular.extend(this, {
			selectAllChk: false,
			perPage : 10,
			total_count:0,
			pageno:1,
			pageChanged:pageChanged
		});

		
		
		
		
		// current page
		$scope.pagination = {
		        current: 1
		    };
		
		// page changed 
		function pageChanged (pageNo) {
			console.log("Page No ::"+pageNo)
			vm.pageno=pageNo;
			loadItems();
			
		}
		$scope.isLoading = false;
		var init=function (){
			loadItems();
				}
		init();
		function loadItems(){
			loadTotalCount();
			var msg = "Items Loaded";
			var url =
				itemUrl +
				"/itemListByPagination/"+vm.pageno+"/"+vm.perPage; ;
			$scope.isLoading = true;
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.items=response.data
				$scope.isLoading = true;
				console.log("Items :: "+JSON.stringify($scope.items))
			})
		}
		function loadTotalCount(){
			var msg = "";

			var url=itemUrl+"/getTotalItemCount";;
		console.log("URL "+url)
			genericFactory.getAll(msg,url).then(function(response) {
				vm.total_count = response.data;
				console.log("count::  "+vm.total_count)
				
			});
		}
		
		$scope.modify=function (index){
			$scope.items[index].edit=true
		}
		$scope.update=function (index,arr){
			$scope.isLoading = true;
			$scope.items[index]=arr
			
			var msg = "Items Loaded";
			var url =
				itemUrl +
				"/updateitem" ;
			console.log("ITEMS :: "+JSON.stringify(arr))
			genericFactory.add(msg, url,arr).then(function (response) {
				$scope.items[index].edit=false
				$scope.isLoading = false;
				
			})
		}
		
	}
})();
