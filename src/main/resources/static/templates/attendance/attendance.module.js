(function() {
	'use strict';
	angular.module('myApp.attendance', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.attendance', {
//			abstract : true,
			url : "/attendance",
			views : {
				"sub" : {
					templateUrl: 'templates/attendance/attendance.html',
					controller : "attendanceController as vm"
				}
			}
		})
	});
})();