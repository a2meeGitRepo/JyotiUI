(function () {
	'use strict';

	angular
		.module('myApp.user')
		.factory('userHttpService', userHttpService);

	userHttpService.$inject = ['$http', '$q', '_', 'localStorageService', 'ApiEndpoint'];

	/* @ngInject */
	function userHttpService($http, $q, _, localStorageService, ApiEndpoint) {
		
		var user = localStorageService.get(ApiEndpoint.userKey);
		var userUrl = ApiEndpoint.url+"user";   // User Url
		var u = staticUrl + '/user';
		var e = staticUrlAttendance + '/employees'
		
		// Variables
		var users = {};

		var service = {
			getUsers : getUsers,
			getEmployees: getEmployees,
			deleteUser : deleteUser,
			createUser : createUser,
			editUser : editUser,
			getRoleOfUser : getRoleOfUser,
			assignRolesTo1User : assignRolesTo1User,
			deleteRolesOf1User : deleteRolesOf1User,
			getPermissionsOf1User : getPermissionsOf1User,
			checkExistingUserId : checkExistingUserId
		};

		return service;
	
		function createUser(user){
			return $http.post(u + '/userpost', user, {timeout: 5000});
		}
		
		function getUsers(){
//			localhost:8091/user/alluser
			return $http.get(u + '/alluser');
		}
		
		function deleteUser(user){
//			localhost:8091/user/{id}
			return $http.delete(u + '/' +user.id);
		}
		
		function editUser(iObj){
//			localhost:8091/user/edit
			return $http.put( u + '/edit', iObj);
		}
		
		function getRoleOfUser(id){
//			localhost:8091/user/userroles/{id}
			return $http.get(u + '/userroles/' + id);
		}
		
		function assignRolesTo1User(iObj){
//			localhost:8091/user/assignroles
			return $http.put(u + '/assignroles/' , iObj);
		}
		
		function deleteRolesOf1User(iObj){
//			localhost:8091/user/assignroles
			return $http.put(u + '/deleteroles/' , iObj);
		}
		
		function getPermissionsOf1User(id){
			//user/permissions/{userid} - get
			return $http.get(u + '/permissions/' + id);
		}
		
		function checkExistingUserId(id){
			//user/usercheck/{userid} - get
			return $http.get(u + '/usercheck/' + id);
		}
		
		function getEmployees(){
			return $http.get(e + '/employeesList');
		}
		
	}
})();
