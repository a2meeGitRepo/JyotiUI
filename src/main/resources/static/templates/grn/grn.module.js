(function() {
	'use strict';
	angular.module('myApp.grn', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.grn', {
//			abstract : true,
			url : "/grn",
			views : {
				"sub" : {
					templateUrl: 'templates/grn/grn.html',
					controller : "grnController as vm"
				}
			}
		})
	});
})();