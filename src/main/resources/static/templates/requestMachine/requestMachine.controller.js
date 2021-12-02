/**
 * @author : Anurag
 * @name : requestMachineController
 * @description : controller for Requesting machine assemblies
 * @date : 17/10/2019
 */

(function () {
	'use strict';

	angular.module('myApp.requestMachine').controller('requestMachineController', requestMachineController).controller('RequestMachineModalCtrl', RequestMachineModalCtrl);

	requestMachineController.$inject = ['$state', '$scope', 'toastr', 'genericFactory', '$filter', '$http', '$rootScope', '$uibModal', '$window','localStorageService', 'ApiEndpoint', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder'];

	RequestMachineModalCtrl.$inject = ['$state', '$scope', 'assmItem', 'toastr', 'genericFactory', 'localStorageService', 'ApiEndpoint', '$filter', '$log', '$uibModalInstance'];
	/* @ngInject */
	function requestMachineController($state, $scope, toastr, genericFactory, $filter, $http, $rootScope, $uibModal, $window, localStorageService, ApiEndpoint, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {

		var loginUser = localStorageService.get(ApiEndpoint.userKey);
		var proOrder = staticUrl + '/proOrder';
		$scope.showTable = false;
		$scope.showAssemblies = false;
		$scope.showReqAssm = false;
		$scope.selectedModel = {};
		$scope.selectedProOrdNo = 0;
		$scope.selectedArr = {};
		$scope.assemblyDetails=[];
		$scope.showUpdButton = false;
		var selectedDataCounter = 0;
		$scope.selectAllCounter = 0;
		$scope.overheadBtn = "Requested Assemblies"

		var vm = angular.extend(this, {
			openRequest: openRequest,
		});


		$scope.dtInstanceCallback = function (instance) {
			$scope.dtInstance = instance;
		};

		$scope.settings = {
			selectAll: false
		}

		// $scope.$watch('settings.selectAll', function (newVal, oldVal) {
		// 	if (newVal == oldVal) return
		// 	var api = $scope.dtInstance.DataTable;
		// 	api.rows({
		// 		search: 'applied'
		// 	}).every(function () {
			//   really only needed if you need to search within the checked values 
		// 		api.cell({
		// 				row: this.index(),
		// 				column: 0
		// 			})
		// 			.nodes()
		// 			.to$()
		// 			.find('input')
		// 			.prop('checked', $scope.settings.selectAll);
		// 	})
		// 	$scope.dtInstance.DataTable.draw()
		// })

		$scope.$watch('settings.selectAll', function(newVal, oldVal) {
			if (newVal == oldVal) return
			var api = $scope.dtInstance.DataTable;
			api.rows({search:'applied'}).every(function() {
				if($scope.assemblyDetails[this.index()].flag != true)
					$scope.assemblyDetails[this.index()].checked = $scope.settings.selectAll;
				$scope.remark = "";
				$scope.requiredDate = null;
			})
			//check data in console
			// console.table(JSON.stringify($scope.assemblyDetails))
			$window.scrollTo({ top: 0, behavior: 'smooth' });
		  })

		$scope.fetchTableData = function () {
			$scope.showUpdButton = false;
			$scope.settings.selectAll = false;
			$scope.overheadBtn = "Requested Assemblies";
			$(".loading").show();
			var msg = "Approved PO Load....', 'Successful !!";
			var url = proOrder + "/getApprovedPo";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.approvedPos = response.data;
				$scope.showTable = true;
				$scope.showAssemblies = false;
				$scope.showReqAssm = false;
				$(".loading").hide();
			});
		}

		$scope.getAssemblies = function (arr) {
			var msg = "Approved PO Load....', 'Successful !!";
			var url = proOrder + "/getReqAssmsByPo?prodOrdNo=" + arr.prodOrdNo;
			// console.log(JSON.stringify(arr))
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.requestedAssms = response.data;
				// console.log(JSON.stringify($scope.requestedAssms))
				if (arr.isApproved == 1) {
					var msg = "Approved PO Load....', 'Successful !!";
					var url = proOrder + "/getAssmByModelCode?modelCode=" + arr.modelCode;
					genericFactory.getAll(msg, url).then(function (response2) {
						$scope.assemblyDetails = response2.data;
						for (var index in $scope.assemblyDetails){
							$scope.assemblyDetails[index].checked = false;
						}
						// console.log(JSON.stringify($scope.assemblyDetails[k]));
						if ($scope.requestedAssms.length > 0) {
							for (var j in $scope.requestedAssms) {
								for (var k in $scope.assemblyDetails) {
									if ($scope.requestedAssms[j].assemblyCode == $scope.assemblyDetails[k].assemblyCode &&
										$scope.requestedAssms[j].assemblyQty == $scope.assemblyDetails[k].assemblyQty) {
										$scope.assemblyDetails[k].flag = true;
										// console.log($scope.assemblyDetails[k]);
									}
								}
							}
						}
						$scope.selectedModel = arr.modelCode;
						$scope.selectedProOrdNo = arr.prodOrdNo;
						$scope.selectedArr = arr;

						$scope.showTable = false;
						$scope.showAssemblies = true;
						$scope.showReqAssm = false;
					});
				} else if (arr.isApproved == 2) {
					var msg = "Approved PO Load....', 'Successful !!";
					var url = proOrder + "/getCustomAssembly?modelCode=" + arr.modelCode + "&prodOrdNo=" + arr.prodOrdNo;
					genericFactory.getAll(msg, url).then(function (response3) {
						$scope.assemblyDetails = response3.data;
						for (var index in $scope.assemblyDetails){
							$scope.assemblyDetails[index].checked = false;
						}
						if ($scope.requestedAssms.length > 0) {
							for (var j in $scope.requestedAssms) {
								for (var k in $scope.assemblyDetails) {
									if ($scope.requestedAssms[j].assemblyCode == $scope.assemblyDetails[k].assemblyCode &&
										$scope.requestedAssms[j].assemblyQty == $scope.assemblyDetails[k].assemblyQty) {
										$scope.assemblyDetails[k].flag = true;
										// console.log($scope.assemblyDetails[k]);
									}
								}
							}
						}
						$scope.selectedModel = arr.modelCode;
						$scope.selectedProOrdNo = arr.prodOrdNo;
						$scope.selectedArr = arr;

						$scope.showTable = false;
						$scope.showAssemblies = true;
						$scope.showReqAssm = false;
					});
				}
			});
		}

		$scope.check = function(i,obj) {
			$scope.assemblyDetails[i].checked = !$scope.assemblyDetails[i].checked;
			$scope.remark = "";
			$scope.requiredDate = null;

			if ($scope.assemblyDetails[i].checked == true) {
				selectedDataCounter++;
			} else{
				selectedDataCounter--;
			}

			if (selectedDataCounter == 0)
				$scope.showUpdButton = false;
			else
				$scope.showUpdButton = true;
		}

		$scope.createReqAssms = function() {
			for (var index in $scope.assemblyDetails){
				if($scope.assemblyDetails[index].checked == true)
					$scope.selectAllCounter++;
			}

			if($scope.selectAllCounter == 0){
				toastr.error("Please select only non-requested assemblies!")
				return;
			}

			var finalArr = [];
			for (var i in $scope.assemblyDetails){
				if($scope.assemblyDetails[i].checked == true){
				var newArr = {};
				newArr.assemblyCode = $scope.assemblyDetails[i].assemblyCode;
				newArr.assemblyDesc = $scope.assemblyDetails[i].assemblyDesc;
				newArr.assemblyQty = $scope.assemblyDetails[i].assemblyQty;
				newArr.uom = $scope.assemblyDetails[i].uom;
				newArr.requestedBy = loginUser.id;
				newArr.requestDateTime = $filter('date')(new Date(), 'dd/MM/yyyy - h:mm:ss a');
				newArr.requiredDate = $scope.requiredDate;
				newArr.status = "R";
				newArr.remark = $scope.remark;
				newArr.model = $scope.assemblyDetails[i].model;
				newArr.proOrderNo = $scope.selectedArr.prodOrdNo;

				finalArr.push(newArr);
				}
			}

			// console.log(JSON.stringify(finalArr));
			var msg = "Requesting Assembly";
			var url = proOrder + "/createReqAssms";
			genericFactory.add(msg, url, finalArr).then(function (response) {
				$scope.getAssemblies($scope.selectedArr);
				$scope.selectAllCounter = 0;
				$scope.showUpdButton = false;
				$scope.settings.selectAll = false;
				$scope.remark = "";
				$scope.requiredDate = null;
			});
		}

		$scope.showReqAssms = function () {
			if (!$scope.showReqAssm) {
				var msg = "Approved PO Load....', 'Successful !!";
				var url = proOrder + "/getReqAssms";
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.reqAssms = response.data;
					$scope.overheadBtn = "Back";
					// console.log(JSON.stringify($scope.reqAssms))
					$scope.showTable = false;
					$scope.showAssemblies = false;
					$scope.showReqAssm = true;
				});
			} else {
				$scope.fetchTableData();
			}
		}

		$scope.updateReqAssm = function (i, arr) {
			var msg = "Assembly Request Closed";
			var url = proOrder + "/assmReceived";
			var entityId = "?reqAssmId=" + arr.reqAssmId;
			genericFactory.get(url, entityId).then(function (response) {
				$scope.showReqAssm = false;
				$scope.showReqAssms();
			});
		}

		$scope.consumeReqAssm = function (i, arr) {
			var msg = "Removing Consumed Assembly";
			var url = proOrder + "/consumeAssm";
			var entityId = "?reqAssmId=" + arr.reqAssmId;

			genericFactory.get(url, entityId).then(function (response) {
				$scope.response = response.data;
				if($scope.response.message == "failed"){
					$scope.showReqAssm = false;
					$scope.showReqAssms();
					toastr.error("Cannot update stock in kitting area. Item not available!")
				} 
				if($scope.response.message == "success"){
					$scope.showReqAssm = false;
					$scope.showReqAssms();
					toastr.success("Assembly Consumed and Updated stock in Kitting Area")
				} 
			});
		}

		/**
		 * @author : Anurag
		 * @Description : Open Pop-up
		 * @date : 17/10/2019
		 */
		function openRequest(arr) {
			var dist = arr ? arr : {};
			dist.modelCode = $scope.selectedModel;
			dist.prodOrdNo = $scope.selectedProOrdNo;
			// console.log(JSON.stringify(dist));
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'templates/requestMachine/reqAssm.html',
				controller: 'RequestMachineModalCtrl',
				backdrop: 'static',
				// keyboard: false,
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					assmItem: function () {
						return dist;
					}
				}
			});

			modalInstance.result.then(function () {

			}, function () {
				$scope.getAssemblies($scope.selectedArr);
				$log.info('Modal dismissed at: ' + new Date());
			});
		}

		var init = function () {
			$scope.fetchTableData();
		}
		init();

	}

	function RequestMachineModalCtrl($state, $scope, assmItem, toastr, genericFactory, localStorageService, ApiEndpoint, $filter, $log, $uibModalInstance) {
		var proOrder = staticUrl + '/proOrder';
		var loginUser = localStorageService.get(ApiEndpoint.userKey);

		var vm = angular.extend(this, {

		});


		(function activate() {
			$scope.assmItem = assmItem;
		})();

		$scope.close = function () {
			$uibModalInstance.dismiss('cancel');
		}

		$scope.createReqAssm = function () {
			var newArr = {};
			newArr.assemblyCode = $scope.assmItem.assemblyCode;
			newArr.assemblyDesc = $scope.assmItem.assemblyDesc;
			newArr.assemblyQty = $scope.assmItem.assemblyQty;
			newArr.uom = $scope.assmItem.uom;
			newArr.requestedBy = loginUser.id;
			newArr.requestDateTime = $filter('date')(new Date(), 'dd/MM/yyyy - h:mm:ss a');
			newArr.requiredDate = $scope.requiredDate;
			newArr.status = "R";
			newArr.remark = $scope.remark;
			newArr.model = $scope.assmItem.model;
			newArr.proOrderNo = $scope.assmItem.prodOrdNo;

			// console.log(JSON.stringify(newArr));
			var msg = "Requesting Assembly";
			var url = proOrder + "/createReqAssm";
			genericFactory.add(msg, url, newArr).then(function (response) {
				$scope.close();
			});
		}

	}
})();
