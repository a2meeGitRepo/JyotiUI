(function() {
	'use strict';
	angular.module('myApp.kittingArea', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.kittingArea', {
//			abstract : true,
			url : "/kittingArea",
			views : {
				"sub" : {
					templateUrl: 'templates/kittingArea/kittingArea.html',
					controller : "kittingAreaController as vm"
				}
			}
		})
	});
})();