(function() {
	'use strict';
	angular.module('myApp.supplierAndItems', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.supplierAndItems', {
//			abstract : true,
			url : "supplierAndItems",
			views : {
				"sub" : {
					templateUrl: 'templates/supplierAndItems/supplierAndItems.html',
					controller : "SupplierAndItemsController as vm"
				}
			}
		})
	});
})();