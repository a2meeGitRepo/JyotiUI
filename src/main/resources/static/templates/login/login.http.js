(function () {
	'use strict';

	angular
		.module('myApp.login')
		.factory('loginHttpFactory', loginHttpFactory);

	loginHttpFactory.$inject = ['$http', '$q', '_', 'localStorageService', 'ApiEndpoint'];

	/* @ngInject */
	function loginHttpFactory($http, $q, _, localStorageService, ApiEndpoint) {
		
		var user = localStorageService.get(ApiEndpoint.userKey);
		var userUrl = staticUrl+"/login";   // User Url
		
		// Variables
		var users = {};

		var service = {
			doLogin : doLogin
		};

		return service;
		
		function doLogin(login){
			var req = {
					 method: 'POST',
					 url: userUrl + '/authenticate',
					 headers: {
					   'Content-Type': "application/json",
					   'Accept': 'application/json',
					   id : login.id,
					   password : login.password
					 },
					 data : {}
				}

				return $http(req);/*.success(function(data, status, headers, config) {
					console.log(data);
			    }).error(function(err){
			    	console.log(err);
			    });*/
				
		}
		
	}
})();
