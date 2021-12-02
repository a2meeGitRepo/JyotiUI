(function() {
	'use strict';

	angular
		.module('myApp.roleManagement')
		.factory('roleManagementService', roleManagementService);

	roleManagementService.$inject = ['roleManagementHttpService', '$q', 'toastr'];
	
	/* @ngInject */
	function roleManagementService(roleManagementHttpService, $q, toastr) {
		var service = {			
				getAllPermissionList : getAllPermissionList,
		};
		
		return service;
		

		function getAllPermissionList(){
			var deferred = $q.defer();
			roleManagementHttpService.getAllPermissionList().then(function(response){
				deferred.resolve(response.data);
			}, function(err){
//				alert(JSON.stringify(err.statusText));
				toastr.error(err.data.message);
			});
			return deferred.promise;
		}
		
		
				
	}

})();
