/**
 * @author : Anurag
 * @name : requestedAssm
 * @description : controller for viewing requested assemblies
 * @date : 17/10/2019
 */

(function () {
	'use strict';

	angular.module('myApp.requestedAssm').controller('requestedAssmController', requestedAssmController);

	requestedAssmController.$inject = ['$state', '$scope', 'toastr', 'genericFactory', '$filter', '$http', '$rootScope', '$uibModal', '$window'];

	/* @ngInject */
	function requestedAssmController($state, $scope, toastr, genericFactory, $filter, $http, $rootScope, $uibModal, $window) {

		var proOrder = staticUrl + '/proOrder';
		$scope.showReqAssm = false;
		$scope.reqAssmsList = [];
		$scope.labels={
			'prodOrdNo': 'Pro Order No.', 
			'modelCode': 'Model Code',
			'assemblyCode': 'Assembly Code',
			'assemblyQty': 'Quantity',
			'requiredDate': 'Date Required',
			'remark': 'Remarks'
		};

		var vm = angular.extend(this, {

		});

		$scope.fetchTableData = function () {
			$(".loading").show();
			var msg = "Requested Assemblies Load....', 'Successful !!";
			var url = proOrder + "/getRequestedAssms";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.reqAssms = response.data;
				for(var i in $scope.reqAssms){
					var iObj = {};
					iObj.prodOrdNo = $scope.reqAssms[i].productionOrder.prodOrdNo;
					iObj.modelCode = $scope.reqAssms[i].model.modelCode;
					iObj.assemblyCode = $scope.reqAssms[i].assemblyCode;
					iObj.assemblyQty = $scope.reqAssms[i].assemblyQty;
					iObj.requiredDate = $filter('date')($scope.reqAssms[i].requiredDate,"dd/MM/yyyy");
					iObj.remark = $scope.reqAssms[i].remark;
					$scope.reqAssmsList.push(iObj);
				}
				$scope.showReqAssm = true;
				$(".loading").hide();
				console.log(JSON.stringify($scope.reqAssms));
			});
		}	

		var init = function () {
			$scope.fetchTableData();
		}
		init();

	}
})();
