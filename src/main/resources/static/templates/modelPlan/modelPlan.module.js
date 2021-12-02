(function() {
	'use strict';
	angular.module('myApp.modelPlan', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.modelPlan', {
//			abstract : true,
			url : "/modelPlan",
			views : {
				"sub" : {
					templateUrl: 'templates/modelPlan/modelPlan.html',
					controller : "modelPlanController as vm"
				}
			}
		})
	});
})();