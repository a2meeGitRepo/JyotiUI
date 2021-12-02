(function() {
	'use strict';

	angular.module('myApp.home').controller('HomeController', HomeController);
	
	HomeController.$inject = ['$scope', 'ApiEndpoint','$state','genericFactory'];


	function HomeController($scope, ApiEndpoint, $state,genericFactory) {
		var dashboardUrl = staticUrl+"dashboard";
		var proOrderUrl = staticUrl + '/proOrder';
		var vm = angular.extend(this, {
			dayArr:[],
			dayBodyArr:[],
			months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			dbModelPlan:[],
			perPage : 10,
			total_count:0,
			pageno:1,
			perPage1 : 10,
			total_count1:0,
			pageno1:1,

		});

		(function activate() {
			var d = new Date();
			var dayofMonth=(new Date(d.getMonth(), d.getFullYear(), 0)).getDate()
				callDayArr(dayofMonth,d.getMonth());
			callDataForPoStatus();
			
			callMaterialStockLocationWise();
			//callMaterialStock();
			todaysTranaction()
			
		})();
		function todaysTranaction(){
			callMaterialStockLocationWiseCount();
			var msg=""
				 var url ="http://localhost:8091/dashboard/todaysTranction"
				genericFactory.getAll(msg,url).then(function(response) {
				vm.materialTranaction = response.data;

				console.log("materialTranaction : "+JSON.stringify(vm.materialTranaction))
								
			});
		}
	/*	function callMaterialStock(){
			callMaterialStockCount();
			var msg=""
				 var url ="http://localhost:8091/dashboard/materialStock?pageno="+vm.pageno1+"&perPage="+vm.perPage1;
				genericFactory.getAll(msg,url).then(function(response) {
				vm.materialStocks = response.data;

				//console.log("Material  Stock : "+JSON.stringify(vm.materialStocks))
								
			});
		}
		
		
		function callMaterialStockCount(){
			var msg=""
				 var url ="http://localhost:8091/dashboard/materialStockCount"
				genericFactory.getAll(msg,url).then(function(response) {
				vm.total_count1 = response.data;
				console.log("total_count: "+vm.total_count1)

								
			});
		}
		
		 $scope.callMaterialStockBySearch=function(search){
			callMaterialStockCountBySearch(search);
			var msg=""
				// var url ="http://localhost:8091/dashboard/materialStockbySearch?pageno="+vm.pageno1+"&perPage="+vm.perPage1+"&search="+search;
			 var url ="http://localhost:8091/dashboard/materialStockbySearch?pageno="+vm.pageno1+"&perPage="+vm.perPage1+"&search="+search;

			genericFactory.getAll(msg,url).then(function(response) {
				vm.materialStocks = response.data;

				//console.log("Material  Stock : "+JSON.stringify(vm.materialStocks))
								
			});
		}
		
		
		function callMaterialStockCountBySearch(search){
			var msg=""
				 var url ="http://localhost:8091/dashboard/materialStockCountBySeach?search="+search
				 
				genericFactory.getAll(msg,url).then(function(response) {
				vm.total_count1 = response.data;
				console.log("total_count: "+vm.total_count1)

								
			});
		}
		
		
		
		$scope.pagination1 = {
		        current1: 1
		    };
		*/
		/*// page changed 
		$scope.pageChangedMaterialStock = function(pageNo){
			vm.pageno1=pageNo;
			callMaterialStock();
			console.log("Call Material Stock")
			
		}
		
		
		
		
		
		
		
		*/
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		function callDayArr(dayofMonth,month){
			
			for(var i=1;i<=dayofMonth;i++)
				{
				console.log("Day :: "+i+"-"+vm.months[month])
				vm.dayArr.push(i+"-"+vm.months[month])
				
				
				}
			console.log("Day Array:: "+JSON.stringify(vm.dayArr))
		}
		
		// current page
		$scope.pagination = {
		        current: 1
		    };
		
		// page changed 
		$scope.pageChanged = function(pageNo){
			vm.pageno=pageNo;
			callMaterialStockLocationWise();
			
		}
		function callMaterialStockLocationWise(){
			callMaterialStockLocationWiseCount();
			var msg=""
				 var url ="http://localhost:8091/dashboard/materialLocationWiseStock?pageno="+vm.pageno+"&perPage="+vm.perPage;
				genericFactory.getAll(msg,url).then(function(response) {
				vm.materialLocationWiseStocks = response.data;

				//console.log("Material Location wise Stock : "+JSON.stringify(vm.materialLocationWiseStocks))
								
			});
		}
		function callMaterialStockLocationWiseCount(){
			var msg=""
				 var url ="http://localhost:8091/dashboard/materialLocationWiseStockCount?pageno="+vm.pageno+"&perPage="+vm.perPage;
				genericFactory.getAll(msg,url).then(function(response) {
				vm.total_count = response.data;
				//console.log("total_count: "+vm.total_count)

								
			});
		}
		
		 $scope.searchByPaginationMaterialStock= function (search){
			 console.log(" Search "+search)
			 $scope.searchByPaginationMaterialStockCount(search);
				var msg=""
					 var url ="http://localhost:8091/dashboard/materialLocationWiseStockSearch?pageno="+vm.pageno+"&perPage="+vm.perPage+"&search="+search;
					genericFactory.getAll(msg,url).then(function(response) {
					vm.materialLocationWiseStocks = response.data;

					//console.log("Material Location wise Stock Search : "+JSON.stringify(vm.materialLocationWiseStocks))
									
				});
		}
		 $scope.searchByPaginationMaterialStockCount= function (search){
				var msg=""
					 var url ="http://localhost:8091/dashboard/materialLocationWiseStockSearchCount?pageno="+vm.pageno+"&perPage="+vm.perPage+"&search="+search;
					genericFactory.getAll(msg,url).then(function(response) {
					vm.total_count = response.data;
					//console.log("total_count: "+vm.total_count)

									
				});
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		function callDataForPoStatus(){
			for(var i=1;i<=5;i++){
				var daybody={};
				if(i%2==0){
					daybody.poIndateDate=i+1+"-Jan"
					daybody.poNo="10001"
						daybody.actualDay=i+6+" Days"
							
								daybody.startDate=i+10+"-May"
								daybody.inProDate=i+13+"-May"
						
								daybody.completeDate=i+25+"-May"
				}else{
					daybody.poIndateDate=i+5+"-May"
					daybody.poNo="10001"
						daybody.actualDay=i+16+" Days"
							
								daybody.startDate=i+15+"-May"
								daybody.inProDate=i+17+"-May"
						
								daybody.completeDate=i+19+"-May"
				}
				
							
							vm.dayBodyArr.push(daybody);
							console.log("Day dayBodyArr:: "+JSON.stringify(vm.dayBodyArr))
			}
			
		}
		
	}
})();
