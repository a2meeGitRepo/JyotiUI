(function() {
	'use strict';

	angular
	.module('myApp.userToRole', [ 'datatables'])	//,'ngMaterial', 'ngMessages' 
	.config(function($stateProvider) {
				$stateProvider
				.state('main.userToRole', {
					url : "/userToRole",
					views : {
						"sub" : {
							templateUrl : "templates/userToRole/userToRole.html",
							controller : "UserToRoleController as vm"
						}
					}
				})
			});

})();