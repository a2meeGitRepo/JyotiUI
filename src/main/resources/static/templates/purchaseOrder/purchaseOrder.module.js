(function() {
	'use strict';
	angular.module('myApp.purchaseOrder', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.purchaseOrder', {
//			abstract : true,
			url : "/purchaseOrder",
			views : {
				"sub" : {
					templateUrl: 'templates/purchaseOrder/purchaseOrder.html',
					controller : "purchaseOrderController as vm"
				}
			}
		})
	});
})();