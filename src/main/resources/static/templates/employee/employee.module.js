(function() {
	'use strict';
	angular.module('myApp.employee', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.employee', {
//			abstract : true,
			url : "/employees",
			views : {
				"sub" : {
					templateUrl: 'templates/employee/employee.html',
					controller : "employeeController as vm"
				}
			}
		})
	});
})();