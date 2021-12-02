(function() {
	'use strict';
	angular.module('myApp.roleManagement', [

	]).config(function($stateProvider) {
		$stateProvider.state('main.roleManagement', {
//			abstract : true,
			url : "/roleManagement",
			views : {
				"sub" : {
					templateUrl: 'templates/roleManagement/roleManagement.html',
					controller : "roleManagementController as vm"
				}
			}
		})
	});
})();