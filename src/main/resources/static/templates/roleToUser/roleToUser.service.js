(function() {
	'use strict';

	angular
		.module('myApp.roleToUser')
		.factory('roleToUserService', roleToUserService);

	roleToUserService.$inject = ['roleToUserHttpService', '$q', 'toastr'];
	
	/* @ngInject */
	function roleToUserService(roleToUserHttpService, $q, toastr) {
		var service = {			
			
		};
		return service;

		
	}

})();