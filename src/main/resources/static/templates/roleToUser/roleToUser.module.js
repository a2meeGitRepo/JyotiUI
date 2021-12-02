(function() {
	'use strict';

	angular
	.module('myApp.roleToUser', [ 'datatables'])	//,'ngMaterial', 'ngMessages' 
	.config(function($stateProvider) {
				$stateProvider
				.state('main.roleToUser', {
					url : "/roleToUser",
					views : {
						"sub" : {
							templateUrl : "templates/roleToUser/roleToUser.html",
							controller : "RoleToUserController as vm"
						}
					}
				})
			});

})();