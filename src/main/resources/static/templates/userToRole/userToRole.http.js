(function () {
	'use strict';

	angular
		.module('myApp.userToRole')
		.factory('userToRoleHttpService', userToRoleHttpService);

	userToRoleHttpService.$inject = ['$http', '$q', '_', 'localStorageService', 'ApiEndpoint'];

	/* @ngInject */
	function userToRoleHttpService($http, $q, _, localStorageService, ApiEndpoint) {
		
		var user = localStorageService.get(ApiEndpoint.userKey);
		var userUrl = ApiEndpoint.url+"user";   // User Url
		var u = staticUrl + '/roles';
		
		// Variables
		var users = {};

		var service = {
				getRolesList : getRolesList,
				getUserListByRole	:	getUserListByRole,
				assign1RoleToMultipleUsers : assign1RoleToMultipleUsers,
				removeRoleOfMultipleUsers : removeRoleOfMultipleUsers,
				getAllRoleDetails : getAllRoleDetails,
				assignPermission : assignPermission,
				activateDeactivateRole : activateDeactivateRole
		};

		return service;
	
		
		function getRolesList(){
//			localhost:8091/roles/allRoles
			return $http.get( u + '/allRoles');
		}
		
		function getUserListByRole(roleId){
//			localhost:8091/roles/getusers/{roleId}	
			return $http.get( u + '/getusers/' + roleId);
		}
		
		function assign1RoleToMultipleUsers(iObj){
//			localhost:8091/roles/assignUser
			return $http.put(u + '/assignUser' , iObj);
		}
		
		function removeRoleOfMultipleUsers(iObj){
			return $http.put(u + '/removeUser' , iObj);
		}
		
		function getAllRoleDetails(){
//			localhost:8091/roles/allRoleDetails
			return $http.get( u + '/allRoleDetails');
		}
		
		function assignPermission(iObj){
//			localhost:8091/roles/assignPermissions
			return $http.put( u + '/assignPermissions', iObj);
		}
		
		function activateDeactivateRole(obj){
//			roles/activate - put
			return $http.put( u + '/activate', obj);
		}
		
	}
})();
