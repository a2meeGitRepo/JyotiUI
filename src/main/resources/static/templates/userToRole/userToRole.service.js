(function() {
	'use strict';

	angular
		.module('myApp.userToRole')
		.factory('userToRoleService', userToRoleService);

	userToRoleService.$inject = ['userToRoleHttpService', '$q', 'toastr'];
	
	/* @ngInject */
	function userToRoleService(userToRoleHttpService, $q, toastr) {
		var service = {			
				getRolesList : getRolesList,
				getUserListByRole : getUserListByRole,
				assign1RoleToMultipleUsers : assign1RoleToMultipleUsers,
				removeRoleOfMultipleUsers  : removeRoleOfMultipleUsers,
				getAllRoleDetails : getAllRoleDetails,
				assignPermission : assignPermission,
				activateDeactivateRole : activateDeactivateRole
		};
		
		return service;
		

		function getRolesList(){
			var deferred = $q.defer();
			userToRoleHttpService.getRolesList().then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
		
		function getUserListByRole(roleId){
			var deferred = $q.defer();
			userToRoleHttpService.getUserListByRole(roleId).then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
		
		function assign1RoleToMultipleUsers(iObj){
			var deferred = $q.defer();
			userToRoleHttpService.assign1RoleToMultipleUsers(iObj).then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
		
		function removeRoleOfMultipleUsers(iObj){
			var deferred = $q.defer();
			userToRoleHttpService.removeRoleOfMultipleUsers(iObj).then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
		
		function getAllRoleDetails(){
			var deferred = $q.defer();
			userToRoleHttpService.getAllRoleDetails().then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
		
		function assignPermission(iObj){
			var deferred = $q.defer();
			userToRoleHttpService.assignPermission(iObj).then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
		
		function activateDeactivateRole(iObj){
			var deferred = $q.defer();
			userToRoleHttpService.activateDeactivateRole(iObj).then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
				
	}

})();