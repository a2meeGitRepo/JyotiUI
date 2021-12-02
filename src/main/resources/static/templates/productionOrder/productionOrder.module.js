(function() {
	'use strict';
	angular.module('myApp.productionOrder', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.productionOrder', {
//			abstract : true,
			url : "/productionOrder",
			views : {
				"sub" : {
					templateUrl: 'templates/productionOrder/productionOrder.html',
					controller : "ProductionOrderController as vm"
				}
			}
		})
	});
})();