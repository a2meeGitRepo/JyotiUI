(function() {
	'use strict';
	angular.module('myApp.requestedAssm', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.requestedAssm', {
//			abstract : true,
			url : "/requestedAssm",
			views : {
				"sub" : {
					templateUrl: 'templates/requestedAssm/requestedAssm.html',
					controller : "requestedAssmController as vm"
				}
			}
		})
	});
})();