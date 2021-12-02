(function() {
	'use strict';
	angular.module('myApp.qrGrn', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.qrGrn', {
//			abstract : true,
			url : "/qrGrn",
			views : {
				"sub" : {
					templateUrl: 'templates/qrGrn/qrGrn.html',
					controller : "qrGrnController as vm"
				}
			}
		})
	});
})();