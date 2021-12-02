/**
  * @author 		: ABS
  * @name			: materialIssueHttpService
  * @description 	: http service for material issue module
  * @date 			: 20/06/2018
  */

(function () {
	'use strict';

	angular
		.module('myApp.roleManagement')
		.factory('roleManagementHttpService', roleManagementHttpService);

	roleManagementHttpService.$inject = ['$http', '$q', '_', 'localStorageService', 'ApiEndpoint'];

	/* @ngInject */
	function roleManagementHttpService($http, $q, _, localStorageService, ApiEndpoint) {
		
		var user = localStorageService.get(ApiEndpoint.userKey);
		var url = ApiEndpoint.url;   // User Url
		var u = staticUrl + '/permission';
		
		var users = {};

		var service = {
				getAllPermissionList : getAllPermissionList
		};
		return service;
		
		function getAllPermissionList(){
//			localhost:8091/permission//allPermissions
			return $http.get( u + '/allPermissions');
		}
		
		
	}
})();
