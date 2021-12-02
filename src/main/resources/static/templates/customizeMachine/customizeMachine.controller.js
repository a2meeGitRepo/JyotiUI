/**
 * @author 		: Anurag
 * @name			: customizeMachineController
 * @description 	: controller for Customize Machine module
 * @date 			: 16/10/2019
 */
(function () {
	'use strict';

	angular.module('myApp.customizeMachine').controller('customizeMachineController', customizeMachineController);
	customizeMachineController.$inject = ['$state', '$scope', 'toastr', 'DTColumnDefBuilder', 'DTOptionsBuilder', 'genericFactory', '$uibModal', "$window"]; //,'DTColumnDefBuilder'

	function customizeMachineController($state, $scope, toastr, DTColumnDefBuilder, DTOptionsBuilder, genericFactory, $uibModal, $window) { //, DTColumnDefBuilder
		var proOrder = staticUrl + '/proOrder';
		var modelPlan = staticUrl + '/modelPlan';

		$scope.showTable = false;
		$scope.showAssemblies = false;
		$scope.addAssembly = false;
		$scope.showComponents = false;
		$scope.addComponent = false;
		$scope.enableAppBtn = true;
		$scope.selectedModel = "";
		$scope.selectedAssembly = "";
		$scope.selectedProdOrd = 0;
		$scope.assemblyCheck = "";
		$scope.compCheck = "";
		$scope.checkingAssm = "";
		$scope.checkingComp = "";
		$scope.disQty = true;
		var assmIndex = 0;
		var compIndex = 0;

		var vm = angular.extend(this, {
			selectAllChk: false,
		});

		/**
		 * @author : Anurag
		 * @description : fetch assemblies on load
		 * @date : 19/06/2018
		 */
		$scope.fetchSalesOrders = function () {
			var msg = "Sales Order PO load....', 'Successful !!";
			var url = proOrder + "/salesOrderlist";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.salesOrders = response.data;
				// console.log(JSON.stringify($scope.salesOrders));
			});
		}

		/**
		 * @author : Anurag
		 * @description : Fetch assemblies on load
		 * @date : 17/10/2019
		 */
		$scope.fetchAssemblies = function () {
			var msg = "Assemblies Load....', 'Successful !!";
			var url = proOrder + "/getAssemblies";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.assemblies = response.data;
				// console.log(JSON.stringify($scope.assemblies));
			});
		}
		
		/**
		 * @author : Praful 
		 * @description : Fetch Component on load
		 * @date : 05/02/2020
		 */
		$scope.fetchAssemblies = function () {
			var msg = "Component Load....', 'Successful !!";
			var url = proOrder + "/getComponents";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.components = response.data;
				// console.log(JSON.stringify($scope.assemblies));
			});
		}

		$scope.resetSO = function () {
			$scope.salesOrder = null;
		}

		$scope.resetPO = function () {
			$scope.proOrderNo = null;
		}

		$scope.fetchTableData = function () {
			$scope.addAssembly = false;
			$scope.showTable = false;
			$scope.showAssemblies = false;
			$scope.enableAppBtn = true;
			if ($scope.proOrderNo) {
				if (isNaN($scope.proOrderNo) || parseInt($scope.proOrderNo) < 0) {
					toastr.error('Please enter proper Production Order Number');
					return;
				}
				var msg = "Table Data By PO No Load....', 'Successful !!";
				//var url = proOrder + "/serchByProOno?proOrderNo=" + $scope.proOrderNo;
				var url = modelPlan + "/pickingByPrdOrdNo?proOrderNo=" + $scope.proOrderNo;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					// console.log(JSON.stringify($scope.allDetails));
					for (var index in $scope.allDetails)
						$scope.allDetails[index].flag = vm.selectAllChk;
					if ($scope.allDetails && $scope.allDetails.length > 0) {
						$scope.showTable = true;
					} else {
						$scope.showTable = false;
						toastr.error('Data is not present for entered Production Order Number');
					}
				});
			} else {
				if (!$scope.salesOrder || $scope.salesOrder == null) {
					toastr.error('Please select Sales Order');
					return;
				}
				var msg = "Table Data By Sales Order load....', 'Successful !!";
				var url = proOrder + "/serchBySalesOno?salesOrder=" + $scope.salesOrder;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.allDetails = response.data;
					// console.log(JSON.stringify($scope.allDetails));
					for (var index in $scope.allDetails)
						$scope.allDetails[index].flag = vm.selectAllChk;
					if ($scope.allDetails && $scope.allDetails.length > 0) {
						$scope.showTable = true;
					} else {
						$scope.showTable = false;
						toastr.error('Data is not present for selected Sales Order No.');
					}
				});
			}
		}

		$scope.approve = function (i, arr) {
			var msg = "Approving without Customization";
			var url = modelPlan + "/approved";
			var entityId = "?pickingId="+ arr.pickingId;
			genericFactory.get(url, entityId).then(function (response) {
				toastr.success(msg);
				$scope.fetchTableData();				
			});
		}

		$scope.process = function (i, arr) {
			var msg = "Getting Assemblies";
			//var url = proOrder + "/getAssmByModelCode?modelCode=" + arr.modelCode;
			$scope.pickingId = arr.pickingId; 
			var url = modelPlan + "/getPickingAssemblyByPicking?pickingId=" + $scope.pickingId;
			console.log("URL :: "+url)
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.assemblyDetails = response.data;
				// console.log(JSON.stringify($scope.assemblyDetails))
				$scope.selectedModel = arr.modelCode;
				$scope.selectedProdOrd = arr.proOrdNo;
				if ($scope.assemblyDetails && $scope.assemblyDetails.length > 0) {
					// console.log(JSON.stringify($scope.assemblyDetails))
					$scope.showAssemblies = true;
					$scope.showTable = false;
				} else {
					$scope.showAssemblies = false;
					$scope.showTable = true;
					toastr.error('Data is not present for selected model');
				}
			});
		}

		$scope.checkQtyChange = function() {
			$scope.enableAppBtn = false;
		}

		$scope.remove = function (i) {
			$scope.assemblyDetails[i].status=3;
			$scope.enableAppBtn = false;
			// console.log(JSON.stringify($scope.assemblyDetails));
		}

		$scope.replace = function(i) {
			assmIndex = i;
			$scope.addAssembly = true;
			$scope.assemblyCheck = "Replace Assembly";
			$scope.checkingAssm = "Replace";
			$window.scrollTo({ top: 0, behavior: 'smooth' });
		}

		$scope.openAddAssm = function() {
			$scope.addAssembly = true;
			$scope.assemblyCheck = "Add Assembly";
			$scope.checkingAssm = "Add";
			$window.scrollTo({ top: 0, behavior: 'smooth' });
		}

		$scope.changeAssm = function(assmObj) {
			$scope.disQty = false;
		}

		$scope.addAssm = function() {
			if($scope.checkingAssm == "Replace"){
				var assemblyObj = {};
				var pickingMst = {};
				pickingMst.pickingId = $scope.pickingId;
				assemblyObj.pickingMst = pickingMst;
				assemblyObj.assemblyMst= $scope.assmObj
				assemblyObj.pickAssmQty= $scope.assmObj.assemblyQty;
				assemblyObj.replacedPickingAssmId = $scope.assemblyDetails[assmIndex].pickingAssmId;
				assemblyObj.remark= "Replaced";
				
				console.log(JSON.stringify(assemblyObj));
			
				$scope.assemblyDetails.splice(assmIndex+1,0,assemblyObj);
				
				$scope.assemblyDetails[assmIndex].status = 4;
				
			//	$scope.assemblyDetails[assmIndex] = $scope.assmObj;
				$scope.enableAppBtn = false;
				$scope.cancelAdd();
				toastr.success("Selected Assembly replaced!");
			}
			if($scope.checkingAssm == "Add"){
				
				var assemblyObj = {};
				var pickingMst = {};
				pickingMst.pickingId = $scope.pickingId;
				assemblyObj.pickingMst = pickingMst;
				assemblyObj.assemblyMst= $scope.assmObj
				assemblyObj.pickAssmQty= $scope.assmObj.assemblyQty;
				
				console.log(JSON.stringify(assemblyObj));
				
				$scope.assemblyDetails.splice(0,0,assemblyObj);
				
			//	$scope.assemblyDetails.unshift($scope.assmObj);
				$scope.enableAppBtn = false;
				$scope.cancelAdd();
				toastr.success("New Assembly Added!");
			}
		}

		$scope.cancelAdd = function() {
			$scope.addAssembly = false;
			$scope.disQty = true;
			$scope.assmObj = null;
			$scope.assemblyCheck = "";
			$scope.checkingAssm = "";
		}

		$scope.approveCustom = function() {
			$scope.enableAppBtn = true;
			for (var index in $scope.assemblyDetails){
				if($scope.assemblyDetails[index].flag){
					toastr.error("Please save quantity before approving!");
					return;
				}
				if($scope.assemblyDetails[index].pickAssmQty == 0 || !$scope.assemblyDetails[index].pickAssmQty){
					toastr.error("Quantity of any assembly cannot be 0. Please remove if required");
					return;
				}
			}

			var newArr = [];
//			for (var ind in $scope.assemblyDetails){
//				var iObj = {};
//				iObj.proOrderNo = $scope.selectedProdOrd;
//				iObj.assemblyCode = $scope.assemblyDetails[ind].assemblyCode;
//				iObj.assemblyDesc = $scope.assemblyDetails[ind].assemblyDesc;
//				iObj.assemblyQty = $scope.assemblyDetails[ind].assemblyQty;
//				iObj.uom = $scope.assemblyDetails[ind].uom;
//				iObj.model = $scope.assemblyDetails[ind].model;
//				newArr.push(iObj);
//			}
			newArr = $scope.assemblyDetails;
			 console.log(JSON.stringify(newArr));

			var msg = "Saving Customized Machine";
		//	var url = proOrder + "/createCustomAssm";
			var url = modelPlan + "/updateAllPickingAssembly";
			genericFactory.add(msg, url, newArr).then(function (response) {
				$scope.fetchTableData();
			});

		}

		// For Component Transaction
		$scope.getComponents = function (i, arr) {
			var msg = "Getting Components";
			//var url = proOrder + "/getAssmByModelCode?modelCode=" + arr.modelCode;
			console.log(JSON.stringify(arr))
			$scope.pickingAssmId = arr.pickingAssmId; 
			var url = modelPlan + "/getPickingComponentByPickingAssembly?pickingAssmId=" + $scope.pickingAssmId;
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.compDetails = response.data;
				 console.log(JSON.stringify($scope.compDetails))
				$scope.selectedAssemblyCode = arr.assemblyMst.assemblyCode;
				if ($scope.compDetails && $scope.compDetails.length > 0) {
					// console.log(JSON.stringify($scope.assemblyDetails))
					$scope.showAssemblies = false;
					$scope.showComponents = true;
					$scope.showTable = false;
					
				} else {
					$scope.showAssemblies = true;
					$scope.showComponents = false;
					$scope.showTable = false;
					toastr.error('Data is not present for selected model');
				}
			});
		}
		
		$scope.removeComponent = function (i) {
			$scope.compDetails[i].status=3;
			$scope.enableAppBtn = false;
			// console.log(JSON.stringify($scope.assemblyDetails));
		}

		$scope.replaceComponent = function(i) {
			compIndex = i;
			$scope.addComponent = true;
			$scope.compCheck = "Replace Component";
			$scope.checkingComp = "Replace";
			$window.scrollTo({ top: 0, behavior: 'smooth' });
		}
		
		$scope.openAddComp = function() {
			$scope.addComponent = true;
			$scope.compCheck = "Add Component";
			$scope.checkingComp = "Add";
			$window.scrollTo({ top: 0, behavior: 'smooth' });
		}
		
		$scope.addComp = function() {
			if($scope.checkingComp == "Replace"){
				var componentObj = {};
				var pickingMst = {};
				var pickingAssembly = {};

				pickingMst.pickingId = $scope.pickingId;
				pickingAssembly.pickingAssmId = $scope.pickingAssmId;
				
				componentObj.pickingMst = pickingMst;
				componentObj.pickingAssembly= pickingAssembly;
				componentObj.componentMst = $scope.compObj;
				componentObj.pickCompQty= $scope.compObj.compQty;
				componentObj.replacedPickingAssmId = $scope.compDetails[compIndex].pickingCompId;
				componentObj.remark= "Replaced";
				
				console.log(JSON.stringify(componentObj));
			
				$scope.compDetails.splice(compIndex+1,0,componentObj);
				
				$scope.compDetails[compIndex].status = 4;
				
			//	$scope.assemblyDetails[assmIndex] = $scope.assmObj;
				$scope.enableAppBtn = false;
				$scope.cancelAdd();
				toastr.success("Selected Component replaced!");
			}
			if($scope.checkingComp == "Add"){
				
				var componentObj = {};
				var pickingMst = {};
				var pickingAssembly = {};
				
				pickingMst.pickingId = $scope.pickingId;
				componentObj.pickingMst = pickingMst;
				componentObj.pickingAssembly= pickingAssembly;
				componentObj.pickCompQty= $scope.compObj.compQty;
				
				console.log(JSON.stringify(componentObj));
				
				$scope.compDetails.splice(0,0,componentObj);
				
			//	$scope.assemblyDetails.unshift($scope.assmObj);
				$scope.enableAppBtn = false;
				$scope.cancelAdd();
				toastr.success("New Assembly Added!");
			}
		}
		
		$scope.approveComponent = function() {
			$scope.enableAppBtn = true;
			for (var index in $scope.compDetails){
				if($scope.compDetails[index].flag){
					toastr.error("Please save quantity before approving!");
					return;
				}
				if($scope.compDetails[index].pickCompQty == 0 || !$scope.compDetails[index].pickCompQty){
					toastr.error("Quantity of any assembly cannot be 0. Please remove if required");
					return;
				}
			}

			var newArr = [];
//			for (var ind in $scope.assemblyDetails){
//				var iObj = {};
//				iObj.proOrderNo = $scope.selectedProdOrd;
//				iObj.assemblyCode = $scope.assemblyDetails[ind].assemblyCode;
//				iObj.assemblyDesc = $scope.assemblyDetails[ind].assemblyDesc;
//				iObj.assemblyQty = $scope.assemblyDetails[ind].assemblyQty;
//				iObj.uom = $scope.assemblyDetails[ind].uom;
//				iObj.model = $scope.assemblyDetails[ind].model;
//				newArr.push(iObj);
//			}
			newArr = $scope.compDetails;
			 console.log(JSON.stringify(newArr));

			var msg = "Saving Customized Machine";
		//	var url = proOrder + "/createCustomAssm";
			var url = modelPlan + "/updateAllPickingComponent";
			genericFactory.add(msg, url, newArr).then(function (response) {
				$scope.fetchTableData();
			});

		}

		var init = function () {
			$scope.fetchSalesOrders();
			$scope.fetchAssemblies();
			// $scope.dtOptions = DTOptionsBuilder.newOptions().withDOM(
			// 	'C<"clear">lfrtip');
			// $scope.dtColumnDefs = [
			// 	DTColumnDefBuilder.newColumnDef(5).notSortable(),
			// 	DTColumnDefBuilder.newColumnDef(5).notSortable()
			// ];			
		}

		init();

	}
})();