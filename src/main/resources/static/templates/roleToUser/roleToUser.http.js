(function () {
	'use strict';

	angular
		.module('myApp.roleToUser')
		.factory('roleToUserHttpService', roleToUserHttpService);

	roleToUserHttpService.$inject = ['$http', '$q', '_', 'localStorageService', 'ApiEndpoint'];

	/* @ngInject */
	function roleToUserHttpService($http, $q, _, localStorageService, ApiEndpoint) {
		
		var user = localStorageService.get(ApiEndpoint.userKey);
		var userUrl = ApiEndpoint.url+"user";   // User Url
		var u = staticUrl + '/user';
		
		// Variables
		var users = {};

		var service = {
			
		};

		return service;
	
		
	}
})();
