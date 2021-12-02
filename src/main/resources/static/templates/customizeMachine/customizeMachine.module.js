(function() {
	'use strict';
	angular.module('myApp.customizeMachine', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.customizeMachine', {
//			abstract : true,
			url : "/customizeMachine",
			views : {
				"sub" : {
					templateUrl: 'templates/customizeMachine/customizeMachine.html',
					controller : "customizeMachineController as vm"
				}
			}
		})
	});
})();