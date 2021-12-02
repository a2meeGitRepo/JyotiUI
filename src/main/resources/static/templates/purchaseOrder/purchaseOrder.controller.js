/**
 * @author : Anurag
 * @name : purchaseOrderController
 * @description : controller for Purchase Order module
 * @date : 30/05/2019
 */

(function () {
	'use strict';

	angular.module('myApp.purchaseOrder').controller('purchaseOrderController', purchaseOrderController);

	purchaseOrderController.$inject = ['$state', '$scope', 'toastr',
		'DTColumnDefBuilder', 'DTOptionsBuilder', 'genericFactory', '$filter', '$http', '$rootScope','$uibModal'];

	/* @ngInject */
	function purchaseOrderController($state, $scope, toastr,
		DTColumnDefBuilder, DTOptionsBuilder, genericFactory, $filter, $http, $rootScope, $uibModal) {

		var purchaseOrder = staticUrl + '/purchaseOrder';
		$scope.changeMaterial = true;
		$scope.materialObj = null;
		$scope.vendor = 'selectVendor';
		$scope.vendorId = "";
		$scope.itemId = "";
		$scope.hideSelectVendor = false;
		$scope.hideSelectMaterial = false;
		$scope.materialDetails = [];
		$scope.vendorDetails = [];
		$scope.selectedVendor = {};
		$scope.showTable = false;
		$scope.oldPo = false;
		$scope.selectAllCheckbox = false;
		var selectedDataCounter = 0;
		$scope.showUpdButton = false;
		var backupData = [];
		$scope.isLoading = false;

		var vm = angular.extend(this, {
			selectAllChk: false,
			
		});

		/**
		 * @author : ABS
		 * @description : fetch vendor details on load.
		 * @date : 19/06/2018
		 */
		$scope.fetchVendorDetails = function () {
			var msg = "Vendor Data Load....', 'Successful !!";
			var url = purchaseOrder + "/purchaseOrderVenList";
			console.log("URL :: "+url)
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.vendorDetails = response.data;
				// console.log(JSON.stringify($scope.vendorDetails));
			});

		}

		/**
		 * @author : ABS
		 * @description : fetch material details on selection of vendor.
		 * @date : 19/06/2018
		 * @param: {Object} vendor - vendor object
		 */
		$scope.fetchMaterialDetails = function (vendor) {
			$scope.materialObj = null;
			$scope.purchaseOrderNo = null;
			$scope.itemId = null;
			$scope.selectedVendor = vendor && vendor != 'selectVendor' ? JSON
				.parse(vendor) : null;
			$scope.hideSelectVendor = true;
			$scope.changeMaterial = false;
			$scope.hideSelectMaterial = false;
			$scope.vendorId = $scope.selectedVendor && $scope.selectedVendor.id ? $scope.selectedVendor.id
				: null;

			var msg = "Material Data Load....', 'Successful !!";
			var url = purchaseOrder + "/purchaseOrderItemList?venId=" + $scope.vendorId;
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.materialDetails = response.data;
				console.log(JSON.stringify($scope.materialDetails));
			});
		}


		/**
		 * @author : ABS
		 * @Description : to store item Id on change
		 * @date : 19/06/2018
		 * @param: {Object} iObj material object
		 */
		$scope.changeMaterialFun = function (iObj) {
			$scope.hideSelectMaterial = true;
			var obj = iObj;
			$scope.itemId = obj.id;
			$scope.vendorRefNo = obj.vendorRefNo;
		}

		/**
		 * @author : Anurag
		 * @Description : Reset other search fields on selecting Purchase Order
		 * @date : 06/06/2019
		 */
		$scope.resetVendor = function () {
			$scope.vendor = 'selectVendor';
			$scope.materialObj = null;
		}

		/**
		 * @author : ABS
		 * @Description : fetch purchaseOrder table data and show
		 * @date : 19/06/2018
		 */
		$scope.fetchTableData = function () {
			$scope.showTable = false;
			vm.selectAllChk = false;
			$scope.showUpdButton = false;
			if ($scope.purchaseOrderNo) {				
				
				if (isNaN($scope.purchaseOrderNo) || parseInt($scope.purchaseOrderNo) < 0) {
					toastr.error('Please enter proper Purchase Order Number');
					return;
				}
				$scope.isLoading = true;
				var msg = "Table Data By PO No Load....', 'Successful !!";
				var url = purchaseOrder + "/searchByPurchaseOrderno?purchaseOrderNo=" + $scope.purchaseOrderNo;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					backupData = angular.copy($scope.allDetails);
					console.log(JSON.stringify($scope.allDetails));					
					$scope.isLoading = false;
					// $scope.oldPo = true;
					for (var index in $scope.allDetails) 
						$scope.allDetails[index].flag = vm.selectAllChk;

					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
					} else {
						$scope.showTable = false;
						toastr
							.error('Data is not present for entered PO Number');
					}
				});

			} else {
				if (!$scope.vendorId || $scope.vendorId == null) {
					toastr.error('Please select vendor');
					return;
				}

				if (!$scope.materialObj) {
					toastr.error('Please select material');
					return;
				}
				if (!$scope.itemId || $scope.materialObj.id!=$scope.itemId) {
					toastr.error('Please select material from dropdown');
					return;
				}
				$scope.isLoading = true;
				var msg = "Table Data By Vendor and Material Load....', 'Successful !!";
				var url = purchaseOrder + "/submitPurchaseOrder?venId=" + $scope.vendorId + "&itemId=" + $scope.itemId;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					backupData = angular.copy($scope.allDetails);
					for (var index in $scope.allDetails) 
						$scope.allDetails[index].flag = vm.selectAllChk;
						$scope.isLoading = false;
					// $scope.oldPo = false;
					console.log(JSON.stringify($scope.allDetails));
					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
						setTimeout(
							function () {
								window
									.scroll({
										top: document.body.scrollHeight,
										left: 0,
										behavior: 'smooth'
									});
							}, 10);

					} else {
						$scope.showTable = false;
						toastr
							.error('Data is not present for selected vendor and material');
					}  
				});

			}
		}

		/**
		 * @author : Anurag
		 * @Description : Enter details manually and copy as well - select 1, select all, clear 1, clear all, copy to checked
		 * @date : 05/06/2019
		 */		
		$scope.check = function(i,obj) {
			$scope.allDetails[i].flag = !$scope.allDetails[i].flag;
			
			if($scope.allDetails[0].flag){
				$scope.allDetails[i].inwardDate = $scope.allDetails[0].inwardDate;
				$scope.allDetails[i].invoiceNumber = $scope.allDetails[0].invoiceNumber;
				$scope.allDetails[i].challanNumber = $scope.allDetails[0].challanNumber;
				$scope.allDetails[i].docDate = $scope.allDetails[0].docDate;
				$scope.allDetails[i].remarks = $scope.allDetails[0].remarks;
				$scope.allDetails[i].type = $scope.allDetails[0].type;
				$scope.allDetails[i].boe = $scope.allDetails[0].boe;
				$scope.allDetails[i].courier = $scope.allDetails[0].courier;
				$scope.allDetails[i].docketNo = $scope.allDetails[0].docketNo;
				$scope.allDetails[i].sapGrnNo = $scope.allDetails[0].sapGrnNo;
				$scope.allDetails[i].sapGrnDate = $scope.allDetails[0].sapGrnDate;
				$scope.allDetails[i].delayDays = $scope.allDetails[0].delayDays;
				$scope.allDetails[i].resPerson = $scope.allDetails[0].resPerson;
				$scope.allDetails[i].delayPerc = $scope.allDetails[0].delayPerc;
				$scope.allDetails[i].accDocHandover = $scope.allDetails[0].accDocHandover;
				$scope.allDetails[i].handoverDate = $scope.allDetails[0].handoverDate;
				$scope.allDetails[i].vehicleNo = $scope.allDetails[0].vehicleNo;
				$scope.allDetails[i].vehicleStatus = $scope.allDetails[0].vehicleStatus;
				$scope.allDetails[i].unloadType = $scope.allDetails[0].unloadType;
				$scope.allDetails[i].packingType = $scope.allDetails[0].packingType;
			}
			
			if ($scope.allDetails[i].inwardDate != null)
				$scope.allDetails[i].inwardDate = new Date($scope.allDetails[i].inwardDate);
			else{
				$scope.allDetails[i].inwardDate = new Date();
			}
			
			if ($scope.allDetails[i].docDate != null)
				$scope.allDetails[i].docDate = new Date($scope.allDetails[i].docDate);
			
			if(!$scope.allDetails[i].flag){
				$scope.clear(i);
			}

			if ($scope.allDetails[i].flag == true) {
				selectedDataCounter++;
			} else{
				selectedDataCounter--;
			}
				
			if (selectedDataCounter == $scope.allDetails.length)
				vm.selectAllChk = true;
			else {
				vm.selectAllChk = false;
			}

			if (selectedDataCounter == 0)
				$scope.showUpdButton = false;
			else
				$scope.showUpdButton = true;
		}

		$scope.selectAll = function() {			
			for (var index in $scope.allDetails) {
				$scope.allDetails[index].flag = vm.selectAllChk;
				
				if($scope.allDetails[0].flag){
					$scope.allDetails[index].inwardDate = $scope.allDetails[0].inwardDate;
					$scope.allDetails[index].invoiceNumber = $scope.allDetails[0].invoiceNumber;
					$scope.allDetails[index].challanNumber = $scope.allDetails[0].challanNumber;
					$scope.allDetails[index].docDate = $scope.allDetails[0].docDate;
					$scope.allDetails[index].remarks = $scope.allDetails[0].remarks;
					$scope.allDetails[index].type = $scope.allDetails[0].type;
					$scope.allDetails[index].boe = $scope.allDetails[0].boe;
					$scope.allDetails[index].courier = $scope.allDetails[0].courier;
					$scope.allDetails[index].docketNo = $scope.allDetails[0].docketNo;
					$scope.allDetails[index].sapGrnNo = $scope.allDetails[0].sapGrnNo;
					$scope.allDetails[index].sapGrnDate = $scope.allDetails[0].sapGrnDate;
					$scope.allDetails[index].delayDays = $scope.allDetails[0].delayDays;
					$scope.allDetails[index].resPerson = $scope.allDetails[0].resPerson;
					$scope.allDetails[index].delayPerc = $scope.allDetails[0].delayPerc;
					$scope.allDetails[index].accDocHandover = $scope.allDetails[0].accDocHandover;
					$scope.allDetails[index].handoverDate = $scope.allDetails[0].handoverDate;
					$scope.allDetails[index].vehicleNo = $scope.allDetails[0].vehicleNo;
					$scope.allDetails[index].vehicleStatus = $scope.allDetails[0].vehicleStatus;
					$scope.allDetails[index].unloadType = $scope.allDetails[0].unloadType;
					$scope.allDetails[index].packingType = $scope.allDetails[0].packingType;
				}
				
				
				if ($scope.allDetails[index].inwardDate != null)
					$scope.allDetails[index].inwardDate = new Date($scope.allDetails[index].inwardDate);
				else
					$scope.allDetails[index].inwardDate = new Date();
				
				if ($scope.allDetails[index].docDate != null)
					$scope.allDetails[index].docDate = new Date($scope.allDetails[index].docDate);
			}
			
			if (vm.selectAllChk) {
				selectedDataCounter = $scope.allDetails.length;
				$scope.showUpdButton = true;
			}
			else {
				selectedDataCounter = 0;
				$scope.showUpdButton = false;
				$scope.clearAll();
			}
		}
		
		$scope.clear = function(i){
			$scope.allDetails[i].inwardDate = backupData[i].inwardDate;
			$scope.allDetails[i].invoiceNumber = backupData[i].invoiceNumber;
			$scope.allDetails[i].challanNumber = backupData[i].challanNumber;
			$scope.allDetails[i].docDate = backupData[i].docDate;
			$scope.allDetails[i].remarks = backupData[i].remarks;
			$scope.allDetails[i].type = backupData[i].type;
			$scope.allDetails[i].boe = backupData[i].boe;
			$scope.allDetails[i].courier = backupData[i].courier;
			$scope.allDetails[i].docketNo = backupData[i].docketNo;
			$scope.allDetails[i].sapGrnNo = backupData[i].sapGrnNo;
			$scope.allDetails[i].sapGrnDate = backupData[i].sapGrnDate;
			$scope.allDetails[i].delayDays = backupData[i].delayDays;
			$scope.allDetails[i].resPerson = backupData[i].resPerson;
			$scope.allDetails[i].delayPerc = backupData[i].delayPerc;
			$scope.allDetails[i].accDocHandover = backupData[i].accDocHandover;
			$scope.allDetails[i].handoverDate = backupData[i].handoverDate;
			$scope.allDetails[i].vehicleNo = backupData[i].vehicleNo;
			$scope.allDetails[i].vehicleStatus = backupData[i].vehicleStatus;
			$scope.allDetails[i].unloadType = backupData[i].unloadType;
			$scope.allDetails[i].packingType = backupData[i].packingType;
		}
		
		$scope.clearAll = function(){
			for (var i in $scope.allDetails){
				$scope.allDetails[i].inwardDate = backupData[i].inwardDate;
				$scope.allDetails[i].invoiceNumber = backupData[i].invoiceNumber;
				$scope.allDetails[i].challanNumber = backupData[i].challanNumber;
				$scope.allDetails[i].docDate = backupData[i].docDate;
				$scope.allDetails[i].remarks = backupData[i].remarks;
				$scope.allDetails[i].type = backupData[i].type;
				$scope.allDetails[i].boe = backupData[i].boe;
				$scope.allDetails[i].courier = backupData[i].courier;
				$scope.allDetails[i].docketNo = backupData[i].docketNo;
				$scope.allDetails[i].sapGrnNo = backupData[i].sapGrnNo;
				$scope.allDetails[i].sapGrnDate = backupData[i].sapGrnDate;
				$scope.allDetails[i].delayDays = backupData[i].delayDays;
				$scope.allDetails[i].resPerson = backupData[i].resPerson;
				$scope.allDetails[i].delayPerc = backupData[i].delayPerc;
				$scope.allDetails[i].accDocHandover = backupData[i].accDocHandover;
				$scope.allDetails[i].handoverDate = backupData[i].handoverDate;
				$scope.allDetails[i].vehicleNo = backupData[i].vehicleNo;
				$scope.allDetails[i].vehicleStatus = backupData[i].vehicleStatus;
				$scope.allDetails[i].unloadType = backupData[i].unloadType;
				$scope.allDetails[i].packingType = backupData[i].packingType;
			}
		}
		
		$scope.copyFields = function(ind, obj){
			if(ind!=0){
				return;
			}
			if(selectedDataCounter == 1){
				return;
			}
			
			for (var i=1; i<$scope.allDetails.length;i++) {
				if($scope.allDetails[i].flag){
					$scope.allDetails[i].inwardDate = obj.inwardDate;
					$scope.allDetails[i].invoiceNumber = obj.invoiceNumber;
					$scope.allDetails[i].challanNumber = obj.challanNumber;
					$scope.allDetails[i].docDate = obj.docDate;
					$scope.allDetails[i].remarks = obj.remarks;
					$scope.allDetails[i].type = obj.type;
					$scope.allDetails[i].boe = obj.boe;
					$scope.allDetails[i].courier = obj.courier;
					$scope.allDetails[i].docketNo = obj.docketNo;
					$scope.allDetails[i].sapGrnNo = obj.sapGrnNo;
					$scope.allDetails[i].sapGrnDate = obj.sapGrnDate;
					$scope.allDetails[i].delayDays = obj.delayDays;
					$scope.allDetails[i].resPerson = obj.resPerson;
					$scope.allDetails[i].delayPerc = obj.delayPerc;
					$scope.allDetails[i].accDocHandover = obj.accDocHandover;
					$scope.allDetails[i].handoverDate = obj.handoverDate;
					$scope.allDetails[i].vehicleNo = obj.vehicleNo;
					$scope.allDetails[i].vehicleStatus = obj.vehicleStatus;
					$scope.allDetails[i].unloadType = obj.unloadType;
					$scope.allDetails[i].packingType = obj.packingType;
				}
			}
		}

		/**
		 * @author : Anurag
		 * @Description : Update details
		 * @date : 05/06/2019
		 */
		$scope.update = function () {
			// console.log(JSON.stringify(arr));
			var newArr = [];
			$scope.isLoading = true;
			for (var index in $scope.allDetails){
				if($scope.allDetails[index].flag){
					var obj = {};
					obj.purchaseOrderItemId = $scope.allDetails[index].purchaseOrderItemId;
					
					obj.inwardDate = $scope.allDetails[index].inwardDate;
					obj.invoiceNumber = $scope.allDetails[index].invoiceNumber;
					obj.challanNumber = $scope.allDetails[index].challanNumber;
					obj.docDate = $scope.allDetails[index].docDate;
					obj.remarks = $scope.allDetails[index].remarks;
					obj.type = $scope.allDetails[index].type;
					obj.boe = $scope.allDetails[index].boe;
					obj.courier = $scope.allDetails[index].courier;
					obj.docketNo = $scope.allDetails[index].docketNo;
					obj.sapGrnNo = $scope.allDetails[index].sapGrnNo;
					obj.sapGrnDate = $scope.allDetails[index].sapGrnDate;
					obj.delayDays = $scope.allDetails[index].delayDays;
					obj.resPerson = $scope.allDetails[index].resPerson;
					obj.delayPerc = $scope.allDetails[index].delayPerc;
					obj.accDocHandover = $scope.allDetails[index].accDocHandover;
					obj.handoverDate = $scope.allDetails[index].handoverDate;
					obj.vehicleNo = $scope.allDetails[index].vehicleNo;
					obj.vehicleStatus = $scope.allDetails[index].vehicleStatus;
					obj.unloadType = $scope.allDetails[index].unloadType;
					obj.packingType = $scope.allDetails[index].packingType;
					obj.updDateTime = new Date();
					
					newArr.push(obj);
				}
			}
			var msg = "Saving Data";
			var url = purchaseOrder + "/updateList";
			 console.log(JSON.stringify(newArr));
			genericFactory.add(msg, url, newArr).then(function (response) {
				$scope.fetchTableData();
				selectedDataCounter = 0;
				$scope.isLoading = false;
			});
		}

		/**
		 * @author : ABS
		 * @Description : init controller
		 * @date : 19/06/2018
		 */
		var init = function () {
			$scope.fetchVendorDetails();

			$scope.dtOptions = DTOptionsBuilder.newOptions()
				.withOption('responsive', true)
				.withOption('scrollX', 'auto')      
				.withOption('scrollCollapse', true)
				.withOption('autoWidth', false)
			$scope.dtColumnDefs = [
				DTColumnDefBuilder.newColumnDef(9).notSortable(),
				DTColumnDefBuilder.newColumnDef(9).notSortable()];

		}
		init();
		
	}
})();
