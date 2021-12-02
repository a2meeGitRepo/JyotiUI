(function() {
	'use strict';
	angular.module('myApp.requestMachine', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.requestMachine', {
//			abstract : true,
			url : "/requestMachine",
			views : {
				"sub" : {
					templateUrl: 'templates/requestMachine/requestMachine.html',
					controller : "requestMachineController as vm"
				}
			}
		})
	});
})();