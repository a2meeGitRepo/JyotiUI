/**
  * @author 		: ABS, Anurag
  * @name			: grnController
  * @description 	: controller for GRN module
  * @date 			: 12/06/2018
  */
(function () {
	'use strict';

	angular.module('myApp.grn').controller('grnController', grnController).controller('GrnModalAddEditCtrl', GrnModalAddEditCtrl).filter('unique', function () {

		return function (items, filterOn) {

			if (filterOn === false) {
				return items;
			}

			if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
				var hashCheck = {}, newItems = [];

				var extractValueToCompare = function (item) {
					if (angular.isObject(item) && angular.isString(filterOn)) {
						return item[filterOn];
					} else {
						return item;
					}
				};

				angular.forEach(items, function (item) {
					var valueToCheck, isDuplicate = false;

					for (var i = 0; i < newItems.length; i++) {
						if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
							isDuplicate = true;
							break;
						}
					}
					if (!isDuplicate) {
						newItems.push(item);
					}

				});
				items = newItems;
			}
			return items;
		};
	});

	grnController.$inject = ['$state', '$scope', 'toastr',
		'DTColumnDefBuilder', 'DTOptionsBuilder', 'genericFactory', 'localStorageService', 'ApiEndpoint', '$filter', '$uibModal'];//,'DTColumnDefBuilder'

	GrnModalAddEditCtrl.$inject = ['$state', '$scope', 'purchaseOrderItem', 'toastr',
		'DTColumnDefBuilder', 'DTOptionsBuilder', 'genericFactory', 'localStorageService', 'ApiEndpoint', '$filter', '$log', '$uibModalInstance'];
	/* @ngInject */
	function grnController($state, $scope, toastr,
		DTColumnDefBuilder, DTOptionsBuilder, genericFactory, localStorageService, ApiEndpoint, $filter, $uibModal) {//, DTColumnDefBuilder
		var loginUser = localStorageService.get(ApiEndpoint.userKey);
		var purchaseOrder = staticUrl + '/purchaseOrder';
		var grn = staticUrl + '/grn';
		$scope.changeMaterial = true;
		$scope.vendorName = ""
		$scope.materialName = '';
		$scope.materialObj = null;
		$scope.vendor = 'selectVendor';
		$scope.grnNo = "";
		$scope.vendorId = "";
		$scope.itemId = "";
		$scope.selectedPoNo = "";
		$scope.hideSelectVendor = false;
		$scope.hideSelectMaterial = false;
		$scope.materialDetails = [];
		$scope.vendorDetails = [];
		$scope.selectedVendor = {};
		$scope.qrCodeArr = [];
		$scope.printButton = true;
		$scope.showTable = false;
		var selectedDataCounter = 0;
		$scope.deviations = [];
		var selectedErrCounter = 0;
		$scope.noDeviation = true;
		$scope.updateDeviationBtn = false;
		$scope.isGrn = false;
		$scope.showFields = true;
		$scope.showDeviations = false;
		$scope.newData = true;
		$scope.grnPossible = false;
		$scope.removeDeviation = true;
		$scope.myDynamicClass = 'btn btn-warning';
		$scope.clearAllChks = false;
		$scope.clearChksBtn = false;

		var vm = angular.extend(this, {
			selectAllChk: false,
			addGrn: addGrn,
		});

		/**
		  * @author : Anurag
		  * @description : fetch error list on load.
		  * @date : 10/06/2019
		  */
		$scope.fetchErrorList = function () {
			var msg = "Error List Load....', 'Successful !!";
			var url = purchaseOrder + "/errorList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.deviations = response.data;
				for (var i = 0; i < $scope.deviations.length; i++)
					$scope.deviations[i].check = false;
			});
		}

		/**
		  * @author : ABS
		  * @description : fetch vendor details on load.
		  * @date : 19/06/2018
		  */
		$scope.fetchVendorDetails = function () {
			var msg = "Vendor Data Load....', 'Successful !!";
			var url = purchaseOrder + "/purchaseOrderVenList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.vendorDetails = response.data;
				 console.log(JSON.stringify($scope.vendorDetails));
			});
		}
		
		/**
		  * @author : Anurag
		  * @description : fetch inwarded PO on load
		  * @date : 06/08/2019
		  */
		$scope.fetchInwardedPo = function () {
			var msg = "Vendor Data Load....', 'Successful !!";
			var url = purchaseOrder + "/inwardedPo";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.inwardedPo = response.data;
				 console.log(JSON.stringify($scope.inwardedPo));
			});
		}

		/**
		  * @author : ABS
		  * @description : fetch material details on selection of vendor.
		  * @date : 19/06/2018
		  * @param: {Object}	vendor - vendor object 
		  */
		$scope.fetchMaterialDetails = function (vendor) {
			$scope.materialObj = null;
			$scope.purchaseOrder = "";
			$scope.purchaseOrderNo = "";
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
				// console.log(JSON.stringify($scope.materialDetails));
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
		$scope.resetVendor = function (iObj) {
			$scope.vendor = 'selectVendor';
			$scope.materialObj = null;
			$scope.purchaseOrderNo = "";
		}
		
		$scope.resetOthers = function(){
			$scope.vendor = 'selectVendor';
			$scope.materialObj = null;
			$scope.purchaseOrder = "";
		}

		/**
		  * @author : ABS
		  * @Description : fetch Deviation Less table data and show
		  * @date : 19/06/2018
		  */
		$scope.fetchTableData = function () {
			$scope.showTable = false;
			$scope.showDeviations = false;
			vm.selectAllChk = false;
			$scope.noDeviation = true;
			$scope.removeDeviation = true;
			$scope.newData = true;
			$scope.grnPossible = false;
			$scope.clearChksBtn = false;

			for (var i = 0; i < $scope.deviations.length; i++)
				$scope.deviations[i].check = false;

			if ($scope.purchaseOrder != "" && $scope.purchaseOrder) {
				var msg = "Table Data By PO No Load....', 'Successful !!";
				var url = purchaseOrder + "/noErrorPoNo?purchaseOrderNo=" + $scope.purchaseOrder;
				console.log("URL :: PO "+url)
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					for (var index in $scope.allDetails) {
						$scope.allDetails[index].check = vm.selectAllChk;
						$scope.allDetails[index].isErrGrn = false;
					}
					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
						$scope.showFields = true;
					} else {
						$scope.showTable = false;
						toastr
							.error('Data is not present for entered PO Number');
					}
				});

			} else if ($scope.purchaseOrderNo) {
				if (isNaN($scope.purchaseOrderNo) || parseInt($scope.purchaseOrderNo) < 0) {
					toastr.error('Please enter proper Purchase Order Number');
					return;
				}
				var msg = "Table Data By PO No Load....', 'Successful !!";
				var url = purchaseOrder + "/noErrorPoNo?purchaseOrderNo=" + $scope.purchaseOrderNo;
				console.log("URL :: PO2"+url)
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					for (var index in $scope.allDetails) {
						$scope.allDetails[index].check = vm.selectAllChk;
						$scope.allDetails[index].isErrGrn = false;
					}
					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
						$scope.showFields = true;
					} else {
						$scope.showTable = false;
						toastr
							.error('Data is not present for entered PO Number');
					}
				});
			
			
			}else {
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
				var msg = "Table Data By Vendor and Material Load....', 'Successful !!";
				var url = purchaseOrder + "/noErrorPo?venId=" + $scope.vendorId + "&itemId=" + $scope.itemId;
				
				console.log("URL :: "+url)
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					console.log(JSON.stringify($scope.allDetails))
					for (var index in $scope.allDetails) {
						$scope.allDetails[index].check = vm.selectAllChk;
						$scope.allDetails[index].isErrGrn = false;
					}
					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
						$scope.showFields = true;
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
		 * @Description : fetch data having Deviations
		 * @date : 11/06/2019
		 */
		$scope.fetchDeviationList = function () {
			$scope.showTable = false;
			$scope.showDeviations = false;
			vm.selectAllChk = false;
			$scope.noDeviation = true;
			$scope.removeDeviation = true;
			$scope.newData = false;
			$scope.grnPossible = false;
			$scope.myDynamicClass = 'btn btn-warning';
			$scope.clearChksBtn = false;

			for (var i = 0; i < $scope.deviations.length; i++)
				$scope.deviations[i].check = false;

			if ($scope.purchaseOrder != "" && $scope.purchaseOrder){
				var msg = "Table Data By PO No Load....', 'Successful !!";
				var url = purchaseOrder + "/devPoNo?purchaseOrderNo=" + $scope.purchaseOrder;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					for (var index in $scope.allDetails)
						$scope.allDetails[index].check = vm.selectAllChk;
					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
						$scope.showFields = false;
					} else {
						$scope.showTable = false;
						toastr
							.error('Data is not present for entered PO Number');
					}
				});

			} else if ($scope.purchaseOrderNo) {
				if (isNaN($scope.purchaseOrderNo) || parseInt($scope.purchaseOrderNo) < 0) {
					toastr.error('Please enter proper Purchase Order Number');
					return;
				}
				var msg = "Table Data By PO No Load....', 'Successful !!";
				var url = purchaseOrder + "/devPoNo?purchaseOrderNo=" + $scope.purchaseOrderNo;
				console.log("URL P :: "+url)
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					for (var index in $scope.allDetails)
						$scope.allDetails[index].check = vm.selectAllChk;
					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
						$scope.showFields = false;
					} else {
						$scope.showTable = false;
						toastr
							.error('Data is not present for entered PO Number');
					}
				});			
			}else {
				if (!$scope.vendorId || $scope.vendorId == null) {
					toastr.error('Please select vendor');
					return;
				}

				if (!$scope.materialObj) {
					toastr.error('Please select material');
					return;
				}
				if (!$scope.itemId) {
					toastr.error('Please select material from dropdown');
					return;
				}
				var msg = "Table Data By Vendor and Material Load....', 'Successful !!";
				var url = purchaseOrder + "/devPo?venId=" + $scope.vendorId + "&itemId=" + $scope.itemId;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;

					for (var index in $scope.allDetails)
						$scope.allDetails[index].check = vm.selectAllChk;

					if ($scope.allDetails
						&& $scope.allDetails.length > 0) {
						$scope.showTable = true;
						$scope.showFields = false;
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
		 * @Description : toggle check box and save data
		 * @date : 07/06/2019
		 */

		$scope.showDeviationsList = function (index) {
			$scope.allDetails[index].check = !$scope.allDetails[index].check;

			if ($scope.allDetails[index].check == true) {
				selectedDataCounter++;
			} else
				selectedDataCounter--;

			if (selectedDataCounter == $scope.allDetails.length)
				vm.selectAllChk = true;
			else {
				vm.selectAllChk = false;
			}

			if (selectedDataCounter == 0)
				$scope.showDeviations = false;
			else
				$scope.showDeviations = true;
			/*------------autoscrol=l---------*/
			window.scroll({
				top : 0,
				left : 0,
				behavior : 'smooth'
			});
			/*------------autoscrol=l---------*/
		}

		/**
		 * @author : Anurag
		 * @Description : select all data on click of Select All checkbox
		 * @date : 07/06/2019
		 */
		$scope.selectAllTable = function () {
			for (var index in $scope.allDetails) {
				$scope.allDetails[index].check = vm.selectAllChk;
				if (vm.selectAllChk)
					$scope.allDetails[index].printCopies = $scope.allDetails[index].printCopies ? $scope.allDetails[index].printCopies : 1;

			}
			if (vm.selectAllChk) {
				selectedDataCounter = $scope.allDetails.length;
				$scope.showDeviations = true;
			}
			else {
				selectedDataCounter = 0;
				$scope.showDeviations = false;
			}
			/*------------autoscrol=l---------*/
			window.scroll({
				top : 0,
				left : 0,
				behavior : 'smooth'
			});
			/*------------autoscrol=l---------*/
		}

		/**
		 * @author : Anurag
		 * @Description : select the deviations
		 * @date : 10/06/2019
		 */
		$scope.checkDeviations = function (index) {
			selectedErrCounter = 0;
			$scope.deviations[index].check = !$scope.deviations[index].check;

			for (var i in $scope.deviations)
				if ($scope.deviations[i].check)
					selectedErrCounter++;

			if (selectedErrCounter == 0) {
				$scope.noDeviation = true;
				$scope.removeDeviation = false;
				$scope.grnPossible = true;
				$scope.myDynamicClass = 'btn btn-success';
				$scope.clearChksBtn = false;
				$scope.clearAllChks = true;
			} else {
				$scope.noDeviation = false;
				$scope.removeDeviation = false;
				$scope.grnPossible = false;
				$scope.myDynamicClass = 'btn btn-warning';
				$scope.clearChksBtn = true;
				$scope.clearAllChks = false;
			}
		}

		/**
		 * @author : Anurag
		 * @Description : Create and send the deviation details of selected PO
		 * @date : 10/06/2019
		 */
		$scope.saveDeviations = function () {
			// debugger
			var cellSelectedArr = [];
			for (var index = 0; index < $scope.allDetails.length; index++) {
				if ($scope.allDetails[index].check) {
					for (var i in $scope.deviations) {
						if ($scope.deviations[i].check) {
							var obj = {};
							obj.purchaseOrderNo = $scope.allDetails[index].purchaseOrderNo;
							obj.purchaseOrderItemId = $scope.allDetails[index].purchaseOrderItemId;
							obj.errorMst = $scope.deviations[i];
							obj.date = new Date();
							cellSelectedArr.push(obj);
						}
					}
				}
				if (index + 1 == $scope.allDetails.length) {
					var msg = "Saving Deviations";
					var url = purchaseOrder + "/poDeviations";
					// console.log(JSON.stringify(cellSelectedArr))
					genericFactory.add(msg, url, cellSelectedArr).then(function (response) {
						$scope.fetchTableData();

					});
					for (var i = 0; i < $scope.deviations.length; i++)
						$scope.deviations[i].check = false;
					$scope.showDeviations = false;
					$scope.noDeviation = true;
					selectedErrCounter = 0;
					selectedDataCounter = 0;
				}
			}
		};


		/**
			* @author : Anurag
			* @Description : Get PO Data having Deviations by PoId
			* @date : 12/06/2019
			*/
		$scope.getErrorList = function (arr) {
			$scope.removeDeviation = true;
			$scope.grnPossible = false;
			$scope.clearChksBtn = true;
			$scope.clearAllChks = false;


			$scope.myDynamicClass = 'btn btn-warning';
			for (var i = 0; i < $scope.deviations.length; i++)
				$scope.deviations[i].check = false;
			// console.log(JSON.stringify(arr));
			$scope.tempArr = arr;
			var msg = '';
			var url = purchaseOrder + "/getErrorlistByPoItemID?&purchaseOrderItemId="
				+ arr.purchaseOrderItemId;
			genericFactory
				.getAll(msg, url)
				.then(
					function (response) {
						$scope.errorListByPoItemId = response.data;
						$scope.showDeviations = true;
						for (var j in $scope.errorListByPoItemId) {
							for (var i = 0; i < $scope.deviations.length; i++) {
								if ($scope.deviations[i].errorId == $scope.errorListByPoItemId[j].errorMst.errorId) {
									$scope.deviations[i].check = true;
								}
							}
						}
					});
		}

		/**
		 * @author : Anurag
		 * @Description : Button function to clear all deviations
		 * @date : 13/06/2019
		 */
		$scope.clearAll = function () {
			for (var i = 0; i < $scope.deviations.length; i++) {
				$scope.deviations[i].check = false;
			}
			$scope.clearAllChks = true;
			$scope.noDeviation = true;
			$scope.grnPossible = true;
			$scope.myDynamicClass = 'btn btn-success';
			$scope.removeDeviation = false;
			selectedErrCounter = 0;
		}


		/**
			* @author : Anurag
			* @Description : Update the deviation details of selected PoId
			* @date : 12/06/2019
			*/
		$scope.updateDeviations = function () {

			var cellSelectedArr = [];
			for (var i = 0; i < $scope.deviations.length; i++) {
				if ($scope.deviations[i].check) {
					var finalArr = {};
					finalArr.purchaseOrderNo = $scope.tempArr.purchaseOrderNo;
					finalArr.purchaseOrderItemId = $scope.tempArr.purchaseOrderItemId;
					finalArr.errorMst = $scope.deviations[i];
					finalArr.date = new Date();
					cellSelectedArr.push(finalArr);
				}
				if (i + 1 == $scope.deviations.length) {
					if (selectedErrCounter > 0) {
						var msg = "Saving Deviations";
						var url = purchaseOrder + "/updateDeviations";
						console.log(JSON.stringify(cellSelectedArr));
						genericFactory.add(msg, url, cellSelectedArr).then(
							function (response) {
								$scope.fetchDeviationList();
								$scope.getErrorList($scope.tempArr);
								$scope.showDeviations = true;
							});

					}
					else {
						var msg = "Deleting Deviations";
						var url = purchaseOrder
							+ "/delDeviations?&purchaseOrderItemId="
							+ $scope.tempArr.purchaseOrderItemId;
						genericFactory.getAll(msg, url).then(
							function (response) {
								$scope.tempArr.isErrGrn = true;
								addGrn($scope.tempArr);
								// console.log(JSON.stringify($scope.tempArr));
							});
					}
				}
			}
		}

		/**
		 * @author : Anurag
		 * @Description : Open Pop-up
		 * @date : 19/06/2019
		 */
		function addGrn(arr) {
			var dist = arr ? arr : {};
			$scope.type=""	
			// console.log(JSON.stringify(dist));
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'templates/grn/addGrn.html',
				controller: 'GrnModalAddEditCtrl',
				backdrop: 'static',
				// keyboard: false,
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					purchaseOrderItem: function () {
						return dist;
					}
				}
			});

			modalInstance.result.then(function () {

			}, function () {
				if (!dist.isErrGrn)
					$scope.fetchTableData();
				else
					$scope.fetchDeviationList();

				selectedErrCounter = 0;
				selectedDataCounter = 0;
				$log.info('Modal dismissed at: ' + new Date());
			});
		}

		/**
		 * @author : ABS
		 * @Description : init controller
		 * @date : 19/06/2018
		 */
		var init = function () {
			$scope.fetchVendorDetails();
			$scope.fetchInwardedPo();
			$scope.fetchErrorList();
			$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM(
				'C<"clear">lfrtip');
			$scope.dtColumnDefs = [
				DTColumnDefBuilder.newColumnDef(5).notSortable(),
				DTColumnDefBuilder.newColumnDef(5).notSortable()
			];
		}
		init();

	}


	function GrnModalAddEditCtrl($state, $scope, purchaseOrderItem, toastr,
		DTColumnDefBuilder, DTOptionsBuilder, genericFactory, localStorageService, ApiEndpoint, $filter, $log, $uibModalInstance) {

		var grn = staticUrl + '/grn';
		var loginUser = localStorageService.get(ApiEndpoint.userKey);
		$scope.isErrPage = false;
		var addedQty = 0;
		$scope.remQty = 0;
		$scope.itemList = [];
		$scope.qtyEntered = true;
		$scope.warnMsg = false;
		$scope.createWarn = false;
		$scope.warn = false;
		$scope.spamBlocker = false;
		$scope.typeSelcted=false;

		var vm = angular.extend(this, {

		});


		(function activate() {
			$scope.purchaseOrderItem = purchaseOrderItem;
			gnrList();
			console.log(JSON.stringify($scope.purchaseOrderItem));
			if($scope.purchaseOrderItem.isErrGrn){
				$scope.createWarn = true;
			}
		})();

		function gnrList() {
			var msg = "Calling GRN";
			var url = grn + "/grnItemList?itemId=" + $scope.purchaseOrderItem.itemMstId;
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.itemList = response.data;
				// console.log(JSON.stringify($scope.itemList));
				if ($scope.itemList.length != 0) {
					for (var i = 0; i < $scope.itemList.length; i++) {
						addedQty += $scope.itemList[i].itemTolRecd;
					}
					$scope.remQty = $scope.purchaseOrderItem.itemQty - addedQty;
				} else {
					$scope.remQty = $scope.purchaseOrderItem.itemQty;
				}
			});
		}
		$scope.selectType=function (type){
			if(type!=""){
				$scope.typeSelcted=false;
			}else{
				$scope.typeSelcted=true;
			}
		}
		$scope.enterQty = function () {
			if ($scope.grnQty > 0 && $scope.boxQty >0){
				$scope.qtyEntered = false;
				$scope.warnMsg = true;
			}else{
				$scope.qtyEntered = true;
				$scope.warnMsg = false;
			}

			// if($scope.grnQty > $scope.remQty)
			// 	$scope.warnMsg = true;
			// else
			// 	$scope.warnMsg = false;
		}
		/**
		  * @author : Anurag
		  * @description : Format the date into a String
		  * @date : 10/06/2019
		  */
		$scope.close = function () {
			if (!$scope.purchaseOrderItem.isErrGrn){
				$uibModalInstance.dismiss('cancel');
			}
			else{
				toastr.error("Deviations removed and Grn Not Created");
				$uibModalInstance.dismiss('cancel');
			}
		}

		/**
		 * @author : Anurag
		 * @description : Format the date into a String
		 * @date : 10/06/2019
		 */
		function formatDate(date) {
			var monthNames = [
				"01", "02", "03",
				"04", "05", "06", "07",
				"08", "09", "10",
				"11", "12"
			];

			var day = date.getDate();
			var monthIndex = date.getMonth();
			var year = date.getFullYear();

			return year + '' + monthNames[monthIndex];
		}



		/**
		  * @author : Anurag
		  * @Description : Create GRN entry for the Error-less or Error PO Number
		  * @date : 10/06/2019
		  */
		$scope.createGrn = function (arr) {
			console.log("ASSS "+JSON.stringify(arr))
			if($scope.type == "" ||  $scope.type == undefined ){
				toastr.error("Please select  type of GRN");
				return;
			}
			
			$scope.spamBlocker = true;
			if (!$scope.purchaseOrderItem.isErrGrn) {
				{
					var randomNo = Math.floor(1000 + Math.random() * 9000);
					var tempGrnNo = formatDate(new Date()) + randomNo;

					var grnArr = {};
					grnArr.purchaseOrderNo = $scope.purchaseOrderItem.purchaseOrderNo;
					grnArr.grnNo = parseInt(tempGrnNo, 10);
					grnArr.grnEntryDate = new Date();
					grnArr.grnStatus = 'inward';
					grnArr.grnBy = loginUser.firstName + ' ' + loginUser.lastName;
					grnArr.inwardTime = $filter('date')(new Date(), 'h:mm:ss a');
					grnArr.errorSolveDate = null;
					grnArr.itemDetails = $scope.purchaseOrderItem.itemDetails;
					grnArr.grnQty = $scope.grnQty;
					grnArr.batchQty = $scope.grnQty;
					grnArr.boxQty = $scope.boxQty;
					grnArr.itemQty = $scope.purchaseOrderItem.itemQty;
					grnArr.itemMsrUnit = $scope.purchaseOrderItem.itemMsrUnit;
					grnArr.itemMstId = $scope.purchaseOrderItem.itemMstId;
					grnArr.netPrice = $scope.purchaseOrderItem.netPrice;
					grnArr.currency = $scope.purchaseOrderItem.currency;
					grnArr.type=$scope.type
					if (grnArr.grnQty == $scope.remQty)
						grnArr.poiStatus = "1";
					else
						grnArr.poiStatus = "0";

					if(grnArr.itemMsrUnit == "EA" & grnArr.grnQty % 1 !== 0 ){
						toastr.error("Please enter a whole number for Quantity");
						return;
					}

					if(grnArr.boxQty % 1 !== 0 ){
						toastr.error("Please enter a whole number for Packages");
						return;
					}

					console.log("GRN AARY "+JSON.stringify(grnArr));

					var msg = "Saving GRN Data";
					var url = grn + "/createGrn";
					genericFactory.add(msg, url, grnArr).then(function (response) {
						$scope.close();
					});
				}
			} else {
				$scope.spamBlocker = true;
				var randomNo = Math.floor(1000 + Math.random() * 9000);
				var tempGrnNo = formatDate(new Date()) + randomNo;

				var grnArr = {};
				grnArr.purchaseOrderNo = $scope.purchaseOrderItem.purchaseOrderNo;
				grnArr.grnNo = parseInt(tempGrnNo, 10);
				grnArr.grnEntryDate = new Date();
				grnArr.grnStatus = 'inward';
				grnArr.grnBy = loginUser.firstName + '_' + loginUser.lastName;
				grnArr.inwardTime = $filter('date')(new Date(), 'h:mm:ss a');
				grnArr.errorSolveDate = new Date();
				grnArr.itemDetails = $scope.purchaseOrderItem.itemDetails;
				grnArr.grnQty = $scope.grnQty;
				grnArr.batchQty = $scope.grnQty;
				grnArr.boxQty = $scope.boxQty;
				grnArr.itemQty = $scope.purchaseOrderItem.itemQty;
				grnArr.itemMsrUnit = $scope.purchaseOrderItem.itemMsrUnit;
				grnArr.itemMstId = $scope.purchaseOrderItem.itemMstId;
				grnArr.netPrice = $scope.purchaseOrderItem.netPrice;
				grnArr.currency = $scope.purchaseOrderItem.currency;

				if (grnArr.grnQty == $scope.remQty)
					grnArr.poiStatus = "1";
				else
					grnArr.poiStatus = "0";

				if(grnArr.itemMsrUnit == "EA" & grnArr.grnQty % 1 !== 0 ){
					toastr.error("Please enter a whole number for Quantity");
					return;
				}

				if(grnArr.boxQty % 1 !== 0 ){
					toastr.error("Please enter a whole number for Packages");
					return;
				}

				// console.log(JSON.stringify(grnArr));
				
				var msg = "Saving GRN Data";
				var url = grn + "/createGrn";
				genericFactory.add(msg, url, grnArr).then(function (response) {
					$scope.close();
				});
			}
		}
	}

})();

