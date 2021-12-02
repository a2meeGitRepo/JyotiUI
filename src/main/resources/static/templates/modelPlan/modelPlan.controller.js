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
		.controller("modelPlanController", modelPlanController);

	modelPlanController.$inject = [
		"$scope",
		"toastr",
		"genericFactory",
		"localStorageService",
		"ApiEndpoint"
	];

	/* @ngInject */
	function modelPlanController(
		$scope,
		toastr,
		genericFactory,
		localStorageService,
		ApiEndpoint
	) {
		var modelPlan = staticUrl + "/modelPlan";
		var bom = staticUrl + "/bom";
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var employee = staticUrlAttendance + '/employees';
		var proOrder = staticUrl + '/proOrder';

		$scope.modelPlans = [];

		$scope.isModelFormOpen = false;

		$scope.modelTable = false;
		$scope.assemblyTable = false;
		$scope.compTable = false;
		$scope.monthlyAssemblyTable = false;
		$scope.monthlyCompTable = false;

		$scope.selectedModelObj = {};
		$scope.searchMonth = "";
		$scope.searchYear = "";
		$scope.isLoading = false;

		var vm = angular.extend(this, {
			selectAllChk: false
		});

		$scope.fetchModels = function () {
			var msg = "Model Master Load....', 'Successful !!";
			var url = bom + "/modelList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.models = response.data;
				// console.log(JSON.stringify($scope.models));
			});
		};

		$scope.fetchModelPlans = function () {
			var msg = "Model Master Load....', 'Successful !!";
			var url = modelPlan + "/modelPlanList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.modelPlans = response.data;
				// console.log(JSON.stringify($scope.modelPlans));
			});
		};

		$scope.fetchPickers = function(){
			var msg = "Pickers Load....', 'Successful !!";
			var url = employee + "/getPickers";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.pickers = response.data;
				// console.log(JSON.stringify($scope.pickers));
			});
		}

		$scope.cancelAdd = function () {
			$scope.modelCode = "";
			$scope.qty = "";
			$scope.month = "";
			$scope.year = "";
			$scope.searchMonth = "";
			$scope.searchYear = "";
			$scope.isModelFormOpen = false;
		};

		$scope.addModelPlan = function () {
			var newArr = [];
			if (
				$scope.modelCode == "" ||
				$scope.qty == "" ||
				$scope.month == "" ||
				$scope.year == ""
			) {
				toastr.error("Please fill all fields!");
				return;
			}

			if ($scope.qty < 1) {
				toastr.error("Please select a quantity above 0!");
				return;
			}
			// for (var i in $scope.modelPlans) {
			// 	if (
			// 		$scope.modelPlans[i].modelCode == $scope.modelCode &&
			// 		$scope.modelPlans[i].month == $scope.month &&
			// 		$scope.modelPlans[i].year == $scope.year &&
			// 		$scope.modelPlans[i].year
			// 	) {
			// 		toastr.error("Model Plan already registered!");
			// 		return;
			// 	}
			// }
			var currDate = new Date();
			
			var dateSecond = currDate.getSeconds() < 10 ? '0'+(currDate.getSeconds()) : (currDate.getSeconds());
			var dateMinute = currDate.getMinutes() < 10 ? '0'+(currDate.getMinutes()) : (currDate.getMinutes());
			var dateHour = currDate.getHours() < 10 ? '0'+(currDate.getHours()) : (currDate.getHours());
			var dateDay = currDate.getDate() < 10 ? '0'+(currDate.getDate()) : (currDate.getDate());
			var dateMonth = (currDate.getMonth() + 1) < 10 ? '0'+(currDate.getMonth() + 1) : (currDate.getMonth() + 1);
			var dateYear = currDate.getFullYear();
			console.log("Quantity ::"+$scope.qty);
			for(var i=0; i< $scope.qty; i++){
				var modelObj = {};
				var serial = ("0000"+(i+1)).slice(-4);
				modelObj.modelCode = $scope.modelCode;
				modelObj.qrcode = $scope.modelCode+"-"+$scope.qty+"-"+dateYear+dateMonth+dateDay+dateHour+dateMinute+dateSecond+"-"+serial;
				modelObj.qty = 1;
				modelObj.month = $scope.month;
				modelObj.year = $scope.year;
				modelObj.updDatetime = new Date();
				modelObj.updUserId = loginUser.id;
				newArr.push(modelObj);
				
			}
			console.log(JSON.stringify(newArr));
			var msg = "Saving New Model Plan";
			var url = modelPlan + "/addModelPlans";
			genericFactory.add(msg, url, newArr).then(function (response) {
				$scope.cancelAdd();
				$scope.modelTable = false;
				$scope.assemblyTable = false;
				$scope.compTable = false;
				$scope.monthlyAssemblyTable = false;
				$scope.monthlyCompTable = false;
			});
		};

		$scope.getModelPlan = function () {
			if (!$scope.searchMonth) {
				toastr.error("Please Select Month");
				return;
			}
			if (!$scope.searchYear) {
				toastr.error("Please Select Year");
				return;
			}
			var msg = "Getting Model Plan";
			var url =
				modelPlan +
				"/getModelByMonth?month=" +
				$scope.searchMonth +
				"&year=" +
				$scope.searchYear;
			console.log("URL :: "+url)
			genericFactory.getAll(msg, url).then(function (response) {
				if (response.data.length != 0) {
					$scope.modelDetails = response.data;
					console.log(JSON.stringify($scope.modelDetails));
					$scope.modelTable = true;
					$scope.assemblyTable = false;
					$scope.compTable = false;
					$scope.monthlyAssemblyTable = false;
					$scope.monthlyCompTable = false;
				} else {
					toastr.error("Data not present for selected fields!");
					$scope.modelTable = false;
					$scope.assemblyTable = false;
					$scope.compTable = false;
					$scope.monthlyAssemblyTable = false;
					$scope.monthlyCompTable = false;
				}
			});
		};
		
		
		/**
		  * @author : Praful Sable
		  * @Description : Modify Modify Picker and PO
		  * @date : 01/01/2020
		  */
		 $scope.modify = function (i) {
			 var msg = "Production Order Data Load..!";
			 console.log("Model Code:"+$scope.modelDetails[i].modelCode);
				var url = proOrder + "/getProOrdNo/"+$scope.modelDetails[i].modelCode;
				genericFactory.getAll(msg, url).then(function (response) {
					vm.prodOrdDetails = response.data;
					 console.log(JSON.stringify(vm.prodOrdDetails));

				});
			$scope.modelDetails[i].flag = true;
				
		}


		$scope.update = function (i, arr) {
				$scope.disbaleUpdate=i
//				 console.log(JSON.stringify(arr));
				var newArr = {};
				
				newArr.modelPlan = arr;
				newArr.modelCode = arr.modelCode;
				newArr.month = arr.month;
				newArr.year = arr.year;
				newArr.pickQty = arr.qty;
				newArr.assignDate =  new Date();
				newArr.employee = JSON.parse(arr.selectedEmp);
				newArr.proOrdNo = arr.selectedProOrdNo;
				newArr.updDatetime = new Date();
				newArr.updUserId = loginUser.id;
				newArr.active = 1;
					
				
				var msg = "Saving Data";
				//var url = modelPlan + "/updateModelPlan";
				var url = modelPlan + "/assignPicker";
				console.log(JSON.stringify(newArr));
				genericFactory.add(msg, url, newArr).then(function (response) {
					$scope.modelDetails[i].flag = false;
					$scope.modelDetails[i].proOrdNo = arr.selectedProOrdNo;
					$scope.modelDetails[i].employee = newArr.employee;
					//$scope.getModelPlan();
				});
			}

		$scope.getAssemblies = function (arr) {
			$scope.selectedModelObj = arr;
			var msg = "Getting Assemblies";
			var url = modelPlan + "/getAssmByModel";
			genericFactory.getData(msg, url, arr).then(function (response) {
				$scope.assemblyDetails = response.data;
				$scope.selectedModel = arr.modelCode;
				$scope.selectedModelQty = arr.qty;
				 console.log("LENGTH :: "+JSON.stringify($scope.assemblyDetails.length));
				$scope.modelTable = false;
				$scope.assemblyTable = true;
				$scope.compTable = false;
				$scope.monthlyAssemblyTable = false;
				$scope.monthlyCompTable = false;
			});
		};

		$scope.getComponents = function (arr) {
			console.log("$scope.selectedModelObj :: "+JSON.stringify($scope.selectedModelObj));
			arr.proOrdNo=$scope.selectedModelObj.proOrdNo
			console.log("arr :: "+JSON.stringify(arr));

			var msg = "Getting Components";
			var url = modelPlan + "/getCompByAssm";
			genericFactory.getData(msg, url, arr).then(function (response) {
				$scope.compDetails = response.data;
				$scope.selectedAssembly = arr.assemblyCode;
				$scope.selectedAssemblyQty = arr.assemblyQty;
				 console.log(JSON.stringify($scope.compDetails));
				$scope.modelTable = false;
				$scope.assemblyTable = false;
				$scope.compTable = true;
				$scope.monthlyAssemblyTable = false;
				$scope.monthlyCompTable = false;
			});
		};

		$scope.getAssembliesByMonth = function () {
			if (!$scope.searchMonth) {
				toastr.error("Please Select Month");
				return;
			}
			if (!$scope.searchYear) {
				toastr.error("Please Select Year");
				return;
			}
			var msg = "Getting Model Plan";
			var url =
				modelPlan +
				"/getAssmByMonth?month=" +
				$scope.searchMonth +
				"&year=" +
				$scope.searchYear;

			genericFactory.getAll(msg, url).then(function (response) {
				if (response.data.length != 0) {
					$scope.monthlyAssemblies = response.data;
					// console.log(JSON.stringify($scope.monthlyAssemblies));
					$scope.modelTable = false;
					$scope.assemblyTable = false;
					$scope.compTable = false;
					$scope.monthlyAssemblyTable = true;
					$scope.monthlyCompTable = false;
				} else {
					toastr.error("Data not present for selected fields!");
					$scope.modelTable = false;
					$scope.assemblyTable = false;
					$scope.compTable = false;
					$scope.monthlyAssemblyTable = false;
					$scope.monthlyCompTable = false;
				}
			});
		};

		$scope.getCompByMonth = function () {
			if (!$scope.searchMonth) {
				toastr.error("Please Select Month");
				return;
			}
			if (!$scope.searchYear) {
				toastr.error("Please Select Year");
				return;
			}
			var msg = "Getting Total Montly Components";
			var url =
				modelPlan +
				"/getCompByMonth?month=" +
				$scope.searchMonth +
				"&year=" +
				$scope.searchYear;
			$scope.isLoading = true;
			genericFactory.getAll(msg, url).then(function (response) {
				if (response.data.length != 0) {
					$scope.monthlyComps = response.data;
					// console.log(JSON.stringify($scope.monthlyComps));
					$scope.isLoading = false;
					$scope.modelTable = false;
					$scope.assemblyTable = false;
					$scope.compTable = false;
					$scope.monthlyAssemblyTable = false;
					$scope.monthlyCompTable = true;
				} else {
					toastr.error("Data not present for selected fields!");
					$scope.isLoading = false;
					$scope.modelTable = false;
					$scope.assemblyTable = false;
					$scope.compTable = false;
					$scope.monthlyAssemblyTable = false;
					$scope.monthlyCompTable = false;
				}
			});
		};

		$scope.setPicker = function(arr){
			if(!arr.selectedEmp){
				return;
			}
			// console.log(JSON.stringify(arr))
			var newArr = {};
			newArr.employee = JSON.parse(arr.selectedEmp);
			newArr.modelCode = arr.modelCode;
			newArr.pickQty = arr.qty;
			newArr.month = arr.month;
			newArr.year = arr.year;
			newArr.modelPlan = arr;
			newArr.assignDate = new Date();

			// console.log(JSON.stringify(newArr))
			$scope.isLoading = true;
			var msg = "Assigning Picker and updating";
			var url = modelPlan + "/assignPicker";
			genericFactory.add(msg, url, newArr).then(function (response) {
				arr.assigned=1;
				$scope.isLoading = false;
				$scope.modelTable = true;
			});
		}

		/**
		 * @author : Anurag
		 * @Description : init controller
		 * @date : 10/07/2019
		 */
		var init = function () {
			$scope.isAdmin = loginUser.id == "001"? true :false;
			$scope.fetchModels();
			$scope.fetchModelPlans();
			$scope.fetchPickers();
			
			$scope.thisYear = new Date().getFullYear();
			var range = [];
			for (var i = 7; i >= 1; i--) {
				range.push($scope.thisYear - i);
			}
			range.push($scope.thisYear);
			for (var j = 1; j < 7; j++) {
				range.push($scope.thisYear + j);
			}
			$scope.years = range;

			$scope.months = [
				"JAN",
				"FEB",
				"MAR",
				"APR",
				"MAY",
				"JUN",
				"JUL",
				"AUG",
				"SEP",
				"OCT",
				"NOV",
				"DEC"
			];
		};
		init();
	}
})();
