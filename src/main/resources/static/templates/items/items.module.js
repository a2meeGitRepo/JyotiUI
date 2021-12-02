(function() {
	'use strict';
	angular.module('myApp.items', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.items', {
//			abstract : true,
			url : "/items",
			views : {
				"sub" : {
					templateUrl: 'templates/items/items.html',
					controller : "ItemsController as vm"
				}
			}
		})
	});
})();