/**
 * @author : Anurag
 * @name : kittingArea
 * @description : controller for viewing kitting area stock
 * @date : 06/11/2019
 */

(function () {
	'use strict';

	angular.module('myApp.kittingArea').controller('kittingAreaController', kittingAreaController);

	kittingAreaController.$inject = ['$state', '$scope', 'toastr', 'genericFactory', '$filter', '$http', '$rootScope', '$uibModal', '$window'];

	/* @ngInject */
	function kittingAreaController($state, $scope, toastr, genericFactory, $filter, $http, $rootScope, $uibModal, $window) {

		var proOrder = staticUrl + '/modelPlan';
		$scope.showKitStock = false;		

		var vm = angular.extend(this, {

		});

		$scope.fetchTableData = function () {
			$(".loading").show();
			var msg = "Kitting Area Stock Load....', 'Successful !!";
			var url = proOrder + "/getKitStock";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.kitStock = response.data;
				$scope.showKitStock = true;
				$(".loading").hide();
				// console.log(JSON.stringify($scope.kitStock));
			});
		}	

		var init = function () {
			$scope.fetchTableData();
		}
		init();

	}
})();
