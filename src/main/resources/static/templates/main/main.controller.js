(function() {
	'use strict';

	angular
		.module('myApp.main')
		.controller('mainController', mainController);

		mainController.$inject = ['localStorageService', 'ApiEndpoint', '$state','loginFactory','$rootScope',"$scope"];

	/* @ngInject */
	function mainController(localStorageService, ApiEndpoint, $state,loginFactory,$rootScope,$scope) {
		var userDetail = localStorageService.get(ApiEndpoint.userKey);
		
		console.log(JSON.stringify(userDetail));
		var vm = angular.extend(this, {
			doLogout : doLogout,
			user : userDetail,
		});

		(function activate() {
			$('.loading').show();
			$rootScope.loader=false;
			$scope.userPermissionDetails  = localStorageService.get('permissions');
			
			 $scope.userPermissionsObj = $scope.userPermissionDetails;
			 $scope.userPermissions = $scope.userPermissionsObj.permissions;
			 console.log(JSON.stringify($scope.userPermissions));
			 givePermissions();
			 
		})();

		// ******************************************************

		function doLogout (){
			loginFactory.ClearCredentials();
			$state.go('login');
			localStorageService.remove(ApiEndpoint.userKey);
			localStorageService.remove('permissions')
		}

		function givePermissions(){

			for(var i = 0; i < $scope.userPermissions.length; i++){

				if($scope.userPermissions[i].permissionValue == "purchaseOrder")
					$scope.showPOMaterial = true;
					
				if($scope.userPermissions[i].permissionValue == "createGrn")
					$scope.showGrn = true;

				if($scope.userPermissions[i].permissionValue == "qrGenerator")
					$scope.showQrGenerator = true;

				if($scope.userPermissions[i].permissionValue == "storageBin")
					$scope.showStorageBins = true;
				
				if($scope.userPermissions[i].permissionValue == "employee")
					$scope.showEmployees = true;

				if($scope.userPermissions[i].permissionValue == "attendance")
					$scope.showAttendance = true;

				if($scope.userPermissions[i].permissionValue == "access_management")
					$scope.showAccessManagement = true;

				if($scope.userPermissions[i].permissionValue == "reports")
					$scope.showReports = true;

				if($scope.userPermissions[i].permissionValue == "uploads")
					$scope.showUploads = true;

				if($scope.userPermissions[i].permissionValue == "modelPlan")
					$scope.showModelPlan = true;

				if($scope.userPermissions[i].permissionValue == "customizeMachine")
					$scope.showCustomizeMachine = true;

				if($scope.userPermissions[i].permissionValue == "requestMachine")
					$scope.showRequestMachine = true;

				if($scope.userPermissions[i].permissionValue == "requestedAssm")
					$scope.showRequestedAssm = true;

				if($scope.userPermissions[i].permissionValue == "kittingArea")
					$scope.showKittingArea = true;
				
			}

			$('.loading').hide();
		}

	}
})();