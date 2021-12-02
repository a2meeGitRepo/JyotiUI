/**
 * @author : ABS
 * @name : materialIssueController
 * @description : controller for material issue module
 * @date : 20/06/2018
 */
(function() {
	'use strict';

	angular.module('myApp.reports').controller('stocksReportController', stocksReportController)
									.controller('grnReportController', grnReportController)
									.controller('deviationReportController', deviationReportController)
									.controller('putAwayReportController', putAwayReportController)
									.controller('pickingReportController', pickingReportController)
									.controller('transactionReportController', transactionReportController)
									.controller('pendingReportController', pendingReportController)
									.controller('DetailpendingReportController', DetailpendingReportController);
	
	stocksReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory'];
	grnReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory', '$filter'];
	deviationReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory', '$filter'];
	putAwayReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory', '$filter'];
	pickingReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory', '$filter'];
	transactionReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory', '$filter'];
	pendingReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory', '$filter','$rootScope'];
	DetailpendingReportController.$inject = [ '$state', '$scope', 'toastr', 'genericFactory', '$filter','$rootScope'];

	function stocksReportController($state, $scope, toastr, genericFactory) {
		var putAway = staticUrl + '/putAway';
		var reportUrl = staticUrl + '/report';
		$scope.itemList = {};
		$scope.itemList.items = [];
		$scope.itemTypes = [];
		$scope.plantTypes = [];
		$scope.storageTypes = [];

		var vm = angular.extend(this, {
			reportsList : [],
			plants : [],
			storages : [],
			items : [],
			itemArr : [],
			labels : {},
			generateReport : generateReport,
			generateReportByDateRange : generateReportByDateRange			
		});

		(function activate() {
			generateReport();

			$scope.selectPlantCode = 'selectPlant';
			$scope.selectStorageCode = 'selectStorage';
			$scope.selectItem = 'selectItem';
			loadStorageList();
			loadPlantList();
			loadItemList();
			vm.labels={'plantCode': 'Plant Code', 'storeLoc': 'Storage Location','itemId': 'Item Id','itemDtl': 'Item Detail','storageBins': 'Location for Apporved QTY.','approQty': 'Approved QTY.','holdQty': 'Hold QTY.','rejQty': 'Rejected QTY.'};
		})();
		
		/**
		 * @author : Anurag
		 * @description : get Plant list on load
		 * @date : 17/07/2018
		 */
		function loadPlantList() {
			var msg = "";
			var url = putAway + "/listPlant";
			genericFactory.getAll(msg, url).then(function(response) {
				vm.plants = response.data;
				console.log(JSON.stringify(vm.plants));
			});
		}

		/**
		 * @author : Anurag
		 * @description : get storage list on load
		 * @date : 17/07/2018
		 */
		function loadStorageList() {
			var msg = "";
			var url = putAway + "/listStorage";
			genericFactory.getAll(msg, url).then(function(response) {
				vm.storages = response.data;
				console.log(JSON.stringify(vm.storages));
			});
		}

		/**
		 * @author : Anurag
		 * @description : get item list on load
		 * @date : 17/07/2018
		 */
		function loadItemList() {
			var msg = "";
			var url = putAway + "/itemList";
			genericFactory.getAll(msg, url).then(function(response) {
				vm.items = response.data;
				// console.log(JSON.stringify(vm.items));
			});
		}
		

		/**
		 * @author : Anurag
		 * @description : Add Plants for Searching
		 * @date : 29/07/2018
		 */
		$scope.addPlant = function() {
			if ($scope.selectedPlant == undefined) {
				toastr.error("Please enter Plant Code");
				return;
			}

			if ($scope.selectedPlant.plant_code != null) {
				if ($scope.plantTypes.length != 0) {
					for (var i = 0; i < $scope.plantTypes.length; i++) {
						if ($scope.plantTypes[i].plant_code == $scope.selectedPlant.plant_code) {
							toastr.error("Same Plant cannot be added again.");
							$scope.selectedPlant = "";
							return;
						}
					}
					$scope.plantTypes.push($scope.selectedPlant);
				} else
					$scope.plantTypes.push($scope.selectedPlant);
			} else {
				toastr.error("Please enter Plant Code");
				return;
			}
			
			$scope.selectedPlant = "";
			generateReport();
		}

		
		
		/**
		 * @author : Anurag
		 * @description : Remove added plant
		 * @date : 29/07/2018
		 */
		$scope.removePlant = function(index) {
			$scope.plantTypes.splice(index, 1);
			if($scope.plantTypes.length == 0){
				$scope.date = null;
			}
				generateReport();
		}
		
		/**
		 * @author : Anurag
		 * @description : Add Storages for Searching
		 * @date : 29/07/2018
		 */
		$scope.addStorage = function() {
			if ($scope.selectedStorage == undefined) {
				toastr.error("Please enter Storage Location");
				return;
			}

			if ($scope.selectedStorage.storage_location != null) {
				if ($scope.storageTypes.length != 0) {
					for (var i = 0; i < $scope.storageTypes.length; i++) {
						if ($scope.storageTypes[i].storage_location == $scope.selectedStorage.storage_location) {
							toastr.error("Same Storage cannot be added again.");
							$scope.selectedStorage = "";
							return;
						}
					}
					$scope.storageTypes.push($scope.selectedStorage);
				} else
					$scope.storageTypes.push($scope.selectedStorage);
			} else {
				toastr.error("Please enter Storage Location");
				return;
			}

			$scope.selectedStorage = "";
			generateReport();
		}

		/**
		 * @author : Anurag
		 * @description : Remove added Storage
		 * @date : 29/07/2018
		 */
		$scope.removeStorage = function(index) {
			$scope.storageTypes.splice(index, 1);
			if($scope.storageTypes.length == 0){
				$scope.date = null;
			}
				generateReport();
		}		
		
		/**
		 * @author : Anurag
		 * @description : Add items for Searching
		 * @date : 29/07/2018
		 */
		$scope.addItem = function() {
			if ($scope.selectedItem == undefined) {
				toastr.error("Please enter Item Name");
				return;
			}

			if ($scope.selectedItem.itemDtl != null) {
				if ($scope.itemTypes.length != 0) {
					for (var i = 0; i < $scope.itemTypes.length; i++) {
						if ($scope.itemTypes[i].itemDtl == $scope.selectedItem.itemDtl) {
							toastr.error("Same Item cannot be added again.");
							$scope.selectedItem = "";
							return;
						}
					}
					$scope.itemTypes.push($scope.selectedItem);
				} else
					$scope.itemTypes.push($scope.selectedItem);
			} else {
				toastr.error("Please enter Item Name");
				return;
			}

			$scope.selectedItem = "";
			generateReport();
		}

		/**
		 * @author : Anurag
		 * @description : Remove added item
		 * @date : 29/07/2018
		 */
		$scope.removeItem = function(index) {
			$scope.itemTypes.splice(index, 1);
			if($scope.itemTypes.length == 0){
				$scope.date = null;
			}
				generateReport();
		}

		/**
		 * @author : Anurag
		 * @description : get report
		 * @date : 17/07/2018
		 */
		function generateReport() {		
			
			if (!$scope.date) {
				vm.reportsList = [];
				return;
			}

			if($scope.itemTypes.length == 0 || $scope.plantTypes.length == 0 || $scope.storageTypes.length == 0){
				toastr.error("Please add data to the fields!")
				$scope.date = new Date("MM-dd-yyyy");
				return;
			}

			$scope.fromDate = null;
			$scope.toDate = null;
			
			var finalObj = {};
			finalObj.items = $scope.itemTypes;
			finalObj.plants = $scope.plantTypes;
			finalObj.stores = $scope.storageTypes;

			var fDateDay = $scope.date.getDate() < 10 ? '0'
					+ ($scope.date.getDate()) : ($scope.date.getDate());
			var fDateMonth = ($scope.date.getMonth() + 1) < 10 ? '0'
					+ ($scope.date.getMonth() + 1)
					: ($scope.date.getMonth() + 1);

			finalObj.date = $scope.date.getFullYear() + '-' + fDateMonth + '-'
					+ fDateDay;

			console.log(JSON.stringify(finalObj));
			var msg = "Getting data from Date";
			var url = reportUrl + "/listStocks";
			genericFactory.getData(msg, url, finalObj).then(function(response) {
				vm.reportsList = response.data;
			});
		}

		/**
		 * @author : Anurag
		 * @description : get report from range date
		 * @date : 17/07/2018
		 */
		function generateReportByDateRange() {
			if ($scope.fromDate == null || $scope.toDate == null) {
				return;
			}
			if ($scope.fromDate > $scope.toDate) {
				toastr.error('start date can not be greater than end date');
				return;
			}

			$scope.plantTypes = [];
			$scope.storageTypes = [];
			$scope.itemTypes = [];
			$scope.date = null;

			var fDateDay = $scope.fromDate.getDate() < 10 ? '0'
					+ ($scope.fromDate.getDate()) : ($scope.fromDate.getDate());
			var fDateMonth = ($scope.fromDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.fromDate.getMonth() + 1) : ($scope.fromDate
					.getMonth() + 1);
			var tDateDay = ($scope.toDate.getDate()) < 10 ? '0'
					+ ($scope.toDate.getDate()) : ($scope.toDate.getDate());
			var tDateMonth = ($scope.toDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.toDate.getMonth() + 1) : ($scope.toDate
					.getMonth() + 1);

			var obj = {
				startDate : $scope.fromDate.getFullYear() + '-' + fDateMonth
						+ '-' + fDateDay,
				endDate : $scope.toDate.getFullYear() + '-' + tDateMonth + '-'
						+ tDateDay
			}

			var msg = "Getting data from Date Range";
			var url = reportUrl + "/listStocksByDate";
			genericFactory.getData(msg, url, obj).then(function(response) {
				vm.reportsList = response.data;
			});
		}
	}
	
	function grnReportController($state, $scope, toastr, genericFactory, $filter) {
		var reportUrl = staticUrl + '/report';

		var vm = angular.extend(this, {
			reportsList : [],
			labels : {},
			generateReport : generateReport,
			generateReportByDateRange : generateReportByDateRange			
		});

		(function activate() {
			generateReport();			
			vm.labels={
					'grnNo': 'GRN No.',
					'purchaseOrderNo': 'Purchase Order No.',
					'grnEntryDate': 'GRN Entry Date',
					'inwardTime': 'Inward Time',
					'itemMstId': 'Item Id',
					'itemDtils': 'Item Detail',
					'venName': 'Vendor Name',
					'itemTolRecd': 'Total Item Received',
					'boxQty': 'Package Quantity',
					'inwardDate': 'Inward Date',
					'invoiceNumber': 'Invoice Number',
					'challanNumber': 'Challan Number',
					'docDate': 'Doc Date',
					'remarks': 'Remarks',
					'type':'IMPORT/DOMESTIC/SERVICE/OTHER',
					'boe':'IMPORT MATERIALS BILL OF ENTRY NO. /IC /IA NO./BOM',
					'courier':'COURIER',
					'docketNo':'DOCKET NO',
					'sapGrnNo':'SAP GRN No',
					'sapGrnDate':'SAP GRN Date',
					'delayDays': 'DELAY DAYS',
					'grnBy':'GRN By',
					'resPerson':'Responsible Person',
					'delayPerc':'Delay percentage',
					'accDocHandover':'ACCOUNT DOC HANDOVER',
					'handoverDate':'ACCOUNT DOC HANDOVER DATE',
					'vehicleNo':'VEHICLE NO.',
					'vehicleStatus':'VEHICLE STATUS',
					'unloadType':'UNLOAD TYPE',
					'packingType':'PACKING TYPE'				
					};
		})();		

		/**
		 * @author : Anurag
		 * @description : get report
		 * @date : 17/07/2018
		 */
		function generateReport() {
			if (!$scope.date) {
				vm.reportsList = [];
				return;
			}

			$scope.fromDate = null;
			$scope.toDate = null;

			var fDateDay = $scope.date.getDate() < 10 ? '0'
					+ ($scope.date.getDate()) : ($scope.date.getDate());
			var fDateMonth = ($scope.date.getMonth() + 1) < 10 ? '0'
					+ ($scope.date.getMonth() + 1)
					: ($scope.date.getMonth() + 1);

			var date = $scope.date.getFullYear() + '-' + fDateMonth + '-'
					+ fDateDay;
			
			var msg = "Getting data from Date";
			var url = reportUrl + "/todaysGrn?date="+date;
			genericFactory.getAll(msg, url).then(function(response) {				
				vm.reportsList = response.data;				
//				console.log(JSON.stringify(vm.reportsList));
				for (var index in vm.reportsList){
					vm.reportsList[index].grnEntryDate = $filter('date')(vm.reportsList[index].grnEntryDate,"dd/MM/yyyy");
					vm.reportsList[index].inwardDate = $filter('date')(vm.reportsList[index].inwardDate,"dd/MM/yyyy");
					vm.reportsList[index].docDate = $filter('date')(vm.reportsList[index].docDate,"dd/MM/yyyy");
					vm.reportsList[index].sapGrnDate = $filter('date')(vm.reportsList[index].sapGrnDate,"dd/MM/yyyy");
					vm.reportsList[index].handoverDate = $filter('date')(vm.reportsList[index].handoverDate,"dd/MM/yyyy");
				}
			});
		}

		/**
		 * @author : Anurag
		 * @description : get report from range date
		 * @date : 17/07/2018
		 */
		function generateReportByDateRange() {
			if ($scope.fromDate == null || $scope.toDate == null) {
				return;
			}
			
			if ($scope.fromDate > $scope.toDate) {
				toastr.error('start date can not be greater than end date');
				return;
			}
			
			$scope.date = null;

			var fDateDay = $scope.fromDate.getDate() < 10 ? '0'
					+ ($scope.fromDate.getDate()) : ($scope.fromDate.getDate());
			var fDateMonth = ($scope.fromDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.fromDate.getMonth() + 1) : ($scope.fromDate
					.getMonth() + 1);
			var tDateDay = ($scope.toDate.getDate()) < 10 ? '0'
					+ ($scope.toDate.getDate()) : ($scope.toDate.getDate());
			var tDateMonth = ($scope.toDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.toDate.getMonth() + 1) : ($scope.toDate
					.getMonth() + 1);

			var startDate = $scope.fromDate.getFullYear() + '-' + fDateMonth + '-' + fDateDay;
			var	endDate = $scope.toDate.getFullYear() + '-' + tDateMonth + '-' + tDateDay;

			var msg = "Getting data from Date Range";
			var url = reportUrl + "/grnByDateRange?startDate="+startDate+"&endDate="+endDate;
			genericFactory.getAll(msg, url).then(function(response) {
				vm.reportsList = response.data;
				for (var index in vm.reportsList){
					vm.reportsList[index].grnEntryDate = $filter('date')(vm.reportsList[index].grnEntryDate,"dd/MM/yyyy");
					vm.reportsList[index].inwardDate = $filter('date')(vm.reportsList[index].inwardDate,"dd/MM/yyyy");
					vm.reportsList[index].docDate = $filter('date')(vm.reportsList[index].docDate,"dd/MM/yyyy");					
					vm.reportsList[index].sapGrnDate = $filter('date')(vm.reportsList[index].sapGrnDate,"dd/MM/yyyy");
					vm.reportsList[index].handoverDate = $filter('date')(vm.reportsList[index].handoverDate,"dd/MM/yyyy");
				}
			});
		}		
	}
	
	
	function deviationReportController($state, $scope, toastr, genericFactory, $filter) {
		var reportUrl = staticUrl + '/report';

		var vm = angular.extend(this, {
			reportsList : [],
			labels : {},
			generateReport : generateReport,
			generateReportByDateRange : generateReportByDateRange			
		});

		(function activate() {
			generateReport();			
			vm.labels={'purchaseOrderNo': 'Purchase Order No.','poItemId': 'Item Id','poItemDtl': 'Item Detail','status': 'Status','error1': 'ZM19','error2': 'PO. No. Missing in Invoice','error3': 'PO Change','error4': 'PO Not Created','error5': 'WH Error','error6': 'Price Difference','error7': 'Quantit1 AMD','error8': 'Tax Code','error9': 'Condition','error10': 'Others'};
		})();		

		/**
		 * @author : Anurag
		 * @description : get report
		 * @date : 17/07/2018
		 */
		function generateReport() {
			if (!$scope.date) {
				vm.reportsList = [];
				return;
			}

			$scope.fromDate = null;
			$scope.toDate = null;

			var fDateDay = $scope.date.getDate() < 10 ? '0'
					+ ($scope.date.getDate()) : ($scope.date.getDate());
			var fDateMonth = ($scope.date.getMonth() + 1) < 10 ? '0'
					+ ($scope.date.getMonth() + 1)
					: ($scope.date.getMonth() + 1);

			var date = $scope.date.getFullYear() + '-' + fDateMonth + '-'
					+ fDateDay;
			
			var msg = "Getting data from Date";
			var url = reportUrl + "/todaysDeviation?date="+date;
			genericFactory.getAll(msg, url).then(function(response) {				
				vm.reportsList = response.data;
				for (var i in vm.reportsList){
					if(vm.reportsList[i].errors.includes("ZM19")) vm.reportsList[i].error1 = 1;
					else vm.reportsList[i].error1 = 0;
					if(vm.reportsList[i].errors.includes("PO. No. Missing in Invoice")) vm.reportsList[i].error2 = 1;
					else vm.reportsList[i].error2 = 0;
					if(vm.reportsList[i].errors.includes("PO Change")) vm.reportsList[i].error3 = 1;
					else vm.reportsList[i].error3 = 0;
					if(vm.reportsList[i].errors.includes("PO Not Created")) vm.reportsList[i].error4 = 1;
					else vm.reportsList[i].error4 = 0;
					if(vm.reportsList[i].errors.includes("WH Error")) vm.reportsList[i].error5 = 1;
					else vm.reportsList[i].error5 = 0;
					if(vm.reportsList[i].errors.includes("Price Difference")) vm.reportsList[i].error6 = 1;
					else vm.reportsList[i].error6 = 0;
					if(vm.reportsList[i].errors.includes("Quantit1 AMD")) vm.reportsList[i].error7 = 1;
					else vm.reportsList[i].error7 = 0;
					if(vm.reportsList[i].errors.includes("Tax Code")) vm.reportsList[i].error8 = 1;
					else vm.reportsList[i].error8 = 0;
					if(vm.reportsList[i].errors.includes("Condition")) vm.reportsList[i].error9 = 1;
					else vm.reportsList[i].error9 = 0;
					if(vm.reportsList[i].errors.includes("Others")) vm.reportsList[i].error10 = 1;
					else vm.reportsList[i].error10 = 0;					
				}
//				console.log(JSON.stringify(vm.reportsList));
			});
		}

		/**
		 * @author : Anurag
		 * @description : get report from range date
		 * @date : 17/07/2018
		 */
		function generateReportByDateRange() {
			if ($scope.fromDate == null || $scope.toDate == null) {
				return;
			}
			
			if ($scope.fromDate > $scope.toDate) {
				toastr.error('start date can not be greater than end date');
				return;
			}
			
			$scope.date = null;

			var fDateDay = $scope.fromDate.getDate() < 10 ? '0'
					+ ($scope.fromDate.getDate()) : ($scope.fromDate.getDate());
			var fDateMonth = ($scope.fromDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.fromDate.getMonth() + 1) : ($scope.fromDate
					.getMonth() + 1);
			var tDateDay = ($scope.toDate.getDate()) < 10 ? '0'
					+ ($scope.toDate.getDate()) : ($scope.toDate.getDate());
			var tDateMonth = ($scope.toDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.toDate.getMonth() + 1) : ($scope.toDate
					.getMonth() + 1);

			var startDate = $scope.fromDate.getFullYear() + '-' + fDateMonth + '-' + fDateDay;
			var	endDate = $scope.toDate.getFullYear() + '-' + tDateMonth + '-' + tDateDay;

			var msg = "Getting data from Date Range";
			var url = reportUrl + "/DeviationByDateRange?startDate="+startDate+"&endDate="+endDate;
			genericFactory.getAll(msg, url).then(function(response) {
				vm.reportsList = response.data;
				for (var i in vm.reportsList){
					if(vm.reportsList[i].errors.includes("ZM19")) vm.reportsList[i].error1 = 1;
					else vm.reportsList[i].error1 = 0;
					if(vm.reportsList[i].errors.includes("PO. No. Missing in Invoice")) vm.reportsList[i].error2 = 1;
					else vm.reportsList[i].error2 = 0;
					if(vm.reportsList[i].errors.includes("PO Change")) vm.reportsList[i].error3 = 1;
					else vm.reportsList[i].error3 = 0;
					if(vm.reportsList[i].errors.includes("PO Not Created")) vm.reportsList[i].error4 = 1;
					else vm.reportsList[i].error4 = 0;
					if(vm.reportsList[i].errors.includes("WH Error")) vm.reportsList[i].error5 = 1;
					else vm.reportsList[i].error5 = 0;
					if(vm.reportsList[i].errors.includes("Price Difference")) vm.reportsList[i].error6 = 1;
					else vm.reportsList[i].error6 = 0;
					if(vm.reportsList[i].errors.includes("Quantit1 AMD")) vm.reportsList[i].error7 = 1;
					else vm.reportsList[i].error7 = 0;
					if(vm.reportsList[i].errors.includes("Tax Code")) vm.reportsList[i].error8 = 1;
					else vm.reportsList[i].error8 = 0;
					if(vm.reportsList[i].errors.includes("Condition")) vm.reportsList[i].error9 = 1;
					else vm.reportsList[i].error9 = 0;
					if(vm.reportsList[i].errors.includes("Others")) vm.reportsList[i].error10 = 1;
					else vm.reportsList[i].error10 = 0;
				}
			});
		}		
	}
	
	function putAwayReportController($state, $scope, toastr, genericFactory, $filter) {
		var reportUrl = staticUrl + '/report';

		var vm = angular.extend(this, {
			reportsList : [],
			labels : {},
			generateReport : generateReport,
			generateReportByDateRange : generateReportByDateRange			
		});

		(function activate() {
			generateReport();			
			vm.labels={'itemId': 'Item Id', 'itemDtl': 'Item Detail', 'plantCode': 'Plant Code', 'storeLoc': 'Store Location','storageBins': 'Storage Bin','approQty': 'Quantity'};
		})();		

		/**
		 * @author : Anurag
		 * @description : get report
		 * @date : 17/07/2018
		 */
		function generateReport() {
			if (!$scope.date) {
				vm.reportsList = [];
				return;
			}

			$scope.fromDate = null;
			$scope.toDate = null;

			var fDateDay = $scope.date.getDate() < 10 ? '0'
					+ ($scope.date.getDate()) : ($scope.date.getDate());
			var fDateMonth = ($scope.date.getMonth() + 1) < 10 ? '0'
					+ ($scope.date.getMonth() + 1)
					: ($scope.date.getMonth() + 1);

			var date = $scope.date.getFullYear() + '-' + fDateMonth + '-'
					+ fDateDay;
			
			var msg = "Getting data from Date";
			var url = reportUrl + "/todaysPutAway?date="+date;
			genericFactory.getAll(msg, url).then(function(response) {				
				vm.reportsList = response.data;				
				console.log(JSON.stringify(vm.reportsList));				
			});
		}

		/**
		 * @author : Anurag
		 * @description : get report from range date
		 * @date : 17/07/2018
		 */
		function generateReportByDateRange() {
			if ($scope.fromDate == null || $scope.toDate == null) {
				return;
			}
			
			if ($scope.fromDate > $scope.toDate) {
				toastr.error('start date can not be greater than end date');
				return;
			}
			
			$scope.date = null;

			var fDateDay = $scope.fromDate.getDate() < 10 ? '0'
					+ ($scope.fromDate.getDate()) : ($scope.fromDate.getDate());
			var fDateMonth = ($scope.fromDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.fromDate.getMonth() + 1) : ($scope.fromDate
					.getMonth() + 1);
			var tDateDay = ($scope.toDate.getDate()) < 10 ? '0'
					+ ($scope.toDate.getDate()) : ($scope.toDate.getDate());
			var tDateMonth = ($scope.toDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.toDate.getMonth() + 1) : ($scope.toDate
					.getMonth() + 1);

			var startDate = $scope.fromDate.getFullYear() + '-' + fDateMonth + '-' + fDateDay;
			var	endDate = $scope.toDate.getFullYear() + '-' + tDateMonth + '-' + tDateDay;

			var msg = "Getting data from Date Range";
			var url = reportUrl + "/putAwayByDateRange?startDate="+startDate+"&endDate="+endDate;
			genericFactory.getAll(msg, url).then(function(response) {
				vm.reportsList = response.data;
			});
		}		
	}

	
	function pickingReportController($state, $scope, toastr, genericFactory) {
		var putAway = staticUrl + '/putAway';
		var modelPlan = staticUrl + '/modelPlan';
		var reportUrl = staticUrl + '/report';
		$scope.poSelect = false;
		$scope.pickingTypes = [];
		
		var vm = angular.extend(this, {
			models : [],
			generateReport : generateReport,
			generateReportByDateRange : generateReportByDateRange,
		});

		(function activate() {
			loadModelList();
			vm.labels={'compCode': 'Material Code', 'plantCode': 'Plant Code','locationCode': 'Location','issueQty': 'Issued Qty','proOrdNo': 'PO Number','movement': 'Movement','reservationNo': 'Reservation No.','itemNo': 'Item No.'};
		})();
		
		/**
		 * @author : Praful Sable
		 * @description : get Model list on load
		 * @date : 06/02/2018
		 */
		function loadModelList() {
			var msg = "";
			var url = modelPlan + "/modelsInPicking";
			genericFactory.getAll(msg, url).then(function(response) {
				vm.models = response.data;
			//	console.log(JSON.stringify(vm.models));
				
			});
		}
		
		$scope.getPOByModel = function(){
			console.log("Model Code:"+$scope.selectedModel);
			var msg = "";
			var url = modelPlan + "/POPickingByModel?modelCode="+$scope.selectedModel;
			genericFactory.getAll(msg, url).then(function(response) {
				vm.pickings = response.data;
				console.log(JSON.stringify(vm.pickings));
				if(vm.pickings.length > 0){
					$scope.poSelect = true;
				}
			});
		}
		
		/**
		 * @author : Praful Sable
		 * @description : get PO list on load
		 * @date : 06/02/2018
		 */
		function loadPOList() {
			var msg = "";
			var url = modelPlan + "/POPickingByModel"+$scope.modelCode;
			genericFactory.getAll(msg, url).then(function(response) {
				vm.proOrders = response.data;
				console.log(JSON.stringify(vm.proOrders));
			});
		}
		
		/**
		 * @author : Praful Sable
		 * @description : Add Picking for Searching
		 * @date : 29/07/2018
		 */
		$scope.addPicking = function() {
			if ($scope.selectedModel == undefined) {
				toastr.error("Please enter Model Code");
				return;
			}
			
			if ($scope.selectedPicking == undefined) {
				toastr.error("Please enter PO ");
				return;
			}

			if ($scope.selectedPicking.proOrdNo != null) {
				if ($scope.pickingTypes.length != 0) {
					for (var i = 0; i < $scope.pickingTypes.length; i++) {
						if ($scope.pickingTypes[i].proOrdNo == $scope.selectedPicking.proOrdNo) {
							toastr.error("Same PO Number cannot be added again.");
							$scope.selectedStorage = "";
							return;
						}
					}
					$scope.pickingTypes.push($scope.selectedPicking);
				} else
					$scope.pickingTypes.push($scope.selectedPicking);
			} else {
				toastr.error("Please enter PO Number");
				return;
			}

			$scope.selectedPicking = "";
			generateReport();
		}

		/**
		 * @author : Praful Sable
		 * @description : Remove added Picking
		 * @date : 06/02/2020
		 */
		$scope.removePicking = function(index) {
			$scope.pickingTypes.splice(index, 1);
			if($scope.pickingTypes.length == 0){
				$scope.date = null;
			}
				generateReport();
		}
		
	    /**
		 * @author : Praful
		 * @description : get report
		 * @date : 06/02/2020
		 */
		function generateReport() {	
			console.log("GENERATE REPORT :: ")
			if (!$scope.date) {
				vm.reportsList = [];
				return;
			}

			
			$scope.fromDate = null;
			$scope.toDate = null;
			
			var finalObj = {};
			finalObj.pickingDtos = $scope.pickingTypes;
			

			var fDateDay = $scope.date.getDate() < 10 ? '0'
					+ ($scope.date.getDate()) : ($scope.date.getDate());
			var fDateMonth = ($scope.date.getMonth() + 1) < 10 ? '0'
					+ ($scope.date.getMonth() + 1)
					: ($scope.date.getMonth() + 1);

			finalObj.date = $scope.date.getFullYear() + '-' + fDateMonth + '-'
					+ fDateDay;

			console.log(JSON.stringify(finalObj));
			var msg = "Getting data from Date";
			var url = reportUrl + "/listPickings";
			genericFactory.getData(msg, url, finalObj).then(function(response) {
				vm.reportsList = response.data;
				console.log(JSON.stringify(vm.reportsList));
			});
		}
	   
		/**
		 * @author : Praful
		 * @description : get report from range date
		 * @date : 06/02/2020
		 */
		function generateReportByDateRange() {
			if ($scope.fromDate == null || $scope.toDate == null) {
				return;
			}
			if ($scope.fromDate > $scope.toDate) {
				toastr.error('start date can not be greater than end date');
				return;
			}

			
			$scope.date = null;

			var fDateDay = $scope.fromDate.getDate() < 10 ? '0'
					+ ($scope.fromDate.getDate()) : ($scope.fromDate.getDate());
			var fDateMonth = ($scope.fromDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.fromDate.getMonth() + 1) : ($scope.fromDate
					.getMonth() + 1);
			var tDateDay = ($scope.toDate.getDate()) < 10 ? '0'
					+ ($scope.toDate.getDate()) : ($scope.toDate.getDate());
			var tDateMonth = ($scope.toDate.getMonth() + 1) < 10 ? '0'
					+ ($scope.toDate.getMonth() + 1) : ($scope.toDate
					.getMonth() + 1);

			var obj = {
				startDate : $scope.fromDate.getFullYear() + '-' + fDateMonth
						+ '-' + fDateDay,
				endDate : $scope.toDate.getFullYear() + '-' + tDateMonth + '-'
						+ tDateDay
			}
			obj.pickingDtos = $scope.pickingTypes;

			var msg = "Getting data from Date Range";
			var url = reportUrl + "/listPickingsByDate";
			genericFactory.getData(msg, url, obj).then(function(response) {
				vm.reportsList = response.data;
			});
		}
		
	}
	
	function transactionReportController($state, $scope, toastr, genericFactory) {
		var putAway = staticUrl + '/putAway';
		var modelPlan = staticUrl + '/modelPlan';
		var reportUrl = staticUrl + '/report';
		$scope.poSelect = false;
		$scope.pickingTypes = [];
		$scope.isLoading = false;
		
		var vm = angular.extend(this, {
			items : [],
			getTransactions : getTransactions
		});

		(function activate() {
			loadItemList();
			vm.labels={'stage': 'Material Stage', 'date': 'Date on Stage','qty': 'Quantity on Stage'};
		})();
		
		/**
		 * @author : Praful Sable
		 * @description : get Model list on load
		 * @date : 06/02/2018
		 */
		function loadItemList() {
			var msg = "";
			var url = putAway + "/itemList";
			genericFactory.getAll(msg, url).then(function(response) {
				vm.items = response.data;
			//	console.log(JSON.stringify(vm.models));
				
			});
		}
		
				
	    /**
		 * @author : Praful
		 * @description : get report
		 * @date : 06/02/2020
		 */
		function getTransactions() {
			$scope.isLoading = true;
			console.log($scope.selectedItem);
			if ($scope.selectedItem=='' || $scope.selectedItem==undefined) {
				toastr.error("Please Select Item");
				return;
			}
			
			if($scope.fromDate!=null || $scope.toDate!=null){
				if ($scope.fromDate > $scope.toDate) {
					toastr.error('start date can not be greater than end date');
					return;
				}
				
				var fDateDay = $scope.fromDate.getDate() < 10 ? '0'
						+ ($scope.fromDate.getDate()) : ($scope.fromDate.getDate());
				var fDateMonth = ($scope.fromDate.getMonth() + 1) < 10 ? '0'
						+ ($scope.fromDate.getMonth() + 1) : ($scope.fromDate
						.getMonth() + 1);
				var tDateDay = ($scope.toDate.getDate()) < 10 ? '0'
						+ ($scope.toDate.getDate()) : ($scope.toDate.getDate());
				var tDateMonth = ($scope.toDate.getMonth() + 1) < 10 ? '0'
						+ ($scope.toDate.getMonth() + 1) : ($scope.toDate
						.getMonth() + 1);

				var obj = {
					startDate : $scope.fromDate.getFullYear() + '-' + fDateMonth
							+ '-' + fDateDay,
					endDate : $scope.toDate.getFullYear() + '-' + tDateMonth + '-'
							+ tDateDay,
					itemMstId : $scope.selectedItem
				}
				var msg = "Getting data from Transactions";
				var url = reportUrl + "/listTransactionDateRange";
				genericFactory.getData(msg, url,obj).then(function(response) {
					vm.reportsList = response.data;
					console.log(JSON.stringify(vm.reportsList));
					$scope.isLoading = false;
				});

			}else{
				
				var msg = "Getting data from Transactions";
				var url = reportUrl + "/listTransaction?itemMstId="+$scope.selectedItem;
				genericFactory.getAll(msg, url).then(function(response) {
					vm.reportsList = response.data;
					console.log(JSON.stringify(vm.reportsList));
					$scope.isLoading = false;
				});
				
			}
			
			
			
			
		}
	   
				
	}

	function pendingReportController($state, $scope, toastr, genericFactory,$rootScope) {
		var putAway = staticUrl + '/putAway';
		var modelPlan = staticUrl + '/modelPlan';
		var reportUrl = staticUrl + '/report';
		$scope.poSelect = false;
		$scope.pickingTypes = [];
		$scope.isLoading = false;
		
		var vm = angular.extend(this, {
			items : [],
			getPendings : getPendings,
			generatePendingReportForToday:generatePendingReportForToday,
		});

		(function activate() {
			//loadItemList();
			vm.labels={'compCode': 'Component Code', 'compDesc': 'Component Description','modelCode': 'Model Code','proOrdNo': 'Production Order No.','assignDate': 'Assign Date','pickCompQty': 'Pending Qty','uom': 'Unit','picker': 'Picker Name'};
		})();
		
		
		function generatePendingReportForToday(){
			//console.log("GENERATE PENDING REPORT TODAY")
			
			var msg = "";
			var url = reportUrl + "/pendingReportManualCall";
			genericFactory.getAll(msg, url).then(function(response) {
				/*vm.items = response.data;
				$rootScope.loader=false;
				console.log("Total Items :: "+JSON.stringify(vm.items));*/
				
			});
		}
		
		/**
		 * @author : Praful Sable
		 * @description : get Model list on load
		 * @date : 06/02/2018
		 */
		function loadItemList() {
			 $rootScope.loader=true;
			console.log("Load Items  ");
			
			var msg = "";
			var url = putAway + "/itemList";
			genericFactory.getAll(msg, url).then(function(response) {
				vm.items = response.data;
				$rootScope.loader=false;
				console.log("Total Items :: "+JSON.stringify(vm.items));
				
			});
		}
		
		/**
		 * @author : Praful
		 * @description : get report
		 * @date : 06/02/2020
		 */
		function getPendings() {
			console.log("GET PENDINGS");
			$scope.isLoading = true;
			console.log("Report By"+$scope.reportBy);
			if($scope.reportBy==undefined){
				console.log("Select Report Type");
				$scope.repByErr=true
			     // document.getElementById("reportBy").focus();
				 
			}else{
				$scope.repByErr=false
			}
			if($scope.reportDate==undefined){
				//console.log("Select Report Type");
				$scope.repDateErr=true
			     // document.getElementById("reportBy").focus();
				 
			}else{
				$scope.repDateErr=false
			}
			var msg = "Getting data from Transactions";
			//			var url = reportUrl + "/listPending?reportBy="+$scope.reportBy;
			var reportData={}
			reportData.reportBy=$scope.reportBy;
			reportData.reportDate=$scope.reportDate;

			var url = reportUrl + "/getPendingReport";
			genericFactory.getData(msg, url,reportData).then(function(response) {
				vm.reportsList = response.data;
				console.log(JSON.stringify(vm.reportsList));
				$scope.isLoading = false;
			});
			
		}	
	}

	
	
	function DetailpendingReportController($state, $scope, toastr, genericFactory,$rootScope) {
		var putAway = staticUrl + '/putAway';
		var modelPlan = staticUrl + '/modelPlan';
		var reportUrl = staticUrl + '/report';
		var supplierUrl = staticUrl + '/suuplier';
		$scope.poSelect = false;
		$scope.pickingTypes = [];
		$scope.isLoading = false;
		
		var vm = angular.extend(this, {
			items : [],
			getPendings : getPendings
		});

		(function activate() {
			//loadItemList();
			$scope.isLoading = true;
			vm.labels={'compCode': 'Component Code', 'compDesc': 'Component Description','modelCode': 'Model Code','proOrdNo': 'Production Order No.','assignDate': 'Assign Date','pickCompQty': 'Pending Qty','uom': 'Unit','picker': 'Picker Name' ,'priorityOrder':'Priority Order','orderStartDate':' Order Start Date','assemblyMatStagePriority':'Model Assembly Stage Priority','materialSource':'Material Source','matMasterLog':' Material Master Log','supplierCode':'Supplier Code ','supplierName':'Supplier Name ','unitPrice':'Unit Price','totalPrice':'Total Amount','scmMode':'SCM Mode' ,'derivedPaymentPriority':'Derived Overall Payment Priority ','paymentType':'Payment Type','derivedPaymentPriorityWrtType':'Derived Overall Payment Priority WRT Type','derivedPaymentPriorityWrtTypeReqDate':'Derived Overall Payment Priority WRT Type Req By Date ','paymentDoneDate':'Payment Date'    };
		})();
		
		/**
		 * @author : Praful Sable
		 * @description : get Model list on load
		 * @date : 06/02/2018
		 */
		function loadItemList() {
			 $rootScope.loader=true;
			console.log("Load Items  ");
			
			var msg = "";
			var url = putAway + "/itemList";
			genericFactory.getAll(msg, url).then(function(response) {
				vm.items = response.data;
				$rootScope.loader=false;
				console.log("Total Items :: "+JSON.stringify(vm.items));
				
			});
		}
		var init=function (){
			$scope.isLoading = false;
		}
		init();
		/**
		 * @author : Praful
		 * @description : get report
		 * @date : 06/02/2020
		 */
		function getPendings() {
			console.log("GET PENDINGS");
			$scope.isLoading = true;
			console.log("Report By"+$scope.reportBy);
			if($scope.reportBy==undefined){
				console.log("Select Report Type");
				$scope.repByErr=true
			     // document.getElementById("reportBy").focus();
				 
			}else{
				$scope.repByErr=false
			}
			if($scope.reportDate==undefined){
				//console.log("Select Report Type");
				$scope.repDateErr=true
			     // document.getElementById("reportBy").focus();
				 
			}else{
				$scope.repDateErr=false
			}
			var msg = "Getting data from Transactions";
			//			var url = reportUrl + "/listPending?reportBy="+$scope.reportBy;
			var reportData={}
			reportData.reportBy=$scope.reportBy;
			reportData.reportDate=$scope.reportDate;

			var url = reportUrl + "/getDetialPendingReport";
			console.log("URL :: "+url)
			genericFactory.add(msg, url,reportData).then(function(response) {
				vm.reportsList = response.data;
				console.log(JSON.stringify("Report Data : "+JSON.stringify(vm.reportsList)));
				$scope.isLoading = false;
			});
			
		}	
		var getListOfSupplier=function (compCode){
			var msg=""
			var url = supplierUrl + "/getsupplierByComponantCode?compCode="+compCode;
			genericFactory.getAll(msg, url).then(function(response) {
				vm.suppliers = response.data;
				console.log(JSON.stringify("suppliers : "+JSON.stringify(vm.suppliers)));
				//$scope.isLoading = false;
			});
		}
		
		
		$scope.modify=function (index){
			vm.reportsList[index].edit=true
			
			getListOfSupplier(vm.reportsList[index].compCode)
		}
		$scope.update=function (index,arr){
			//$scope.isLoading = true;
			vm.reportsList[index]=arr
			
			var msg = "Items Loaded";
			var url =
				reportUrl +
				"/updatePendingReport" ;
			console.log("ITEMS :: "+JSON.stringify(arr))
			genericFactory.add(msg, url,arr).then(function (response) {
				$scope.reportsList[index].edit=false
			//	$scope.isLoading = false;
				
			})
		}
	}

	
})();