(function() {
	'use strict';

	angular.module('myApp.roleToUser').controller('RoleToUserController', RoleToUserController);
	RoleToUserController.$inject = [ '$state', 'userService', 'userToRoleService', '$uibModal', '$log', '$scope', 'toastr'];

	/* @ngInject */
	function RoleToUserController($state, userService, userToRoleService, $uibModal, $log, $scope, toastr) {
		var vm = angular.extend(this, {
			rolesList : [],
			changeRole : changeRole,
			assignRoleToMultipleUsers : assignRoleToMultipleUsers,
			removeRoleOfMultipleUsers : removeRoleOfMultipleUsers
		});

		(function activate() {
			$scope.selectRole = 'selectRole';
			
			loadRolesList();
		})();

		
		function loadRolesList(){
			userToRoleService.getRolesList().then(function(data){
				vm.rolesList = data;
			});
		}
		
		function changeRole(iObj){
			if($scope.selectRole == 'selectRole'){
				return;
			}
			
			var roleObj = JSON.parse($scope.selectRole);
			userToRoleService.getUserListByRole(roleObj.id).then(function(data){
				vm.usersWithoutRoles = data.userwithoutrole;
				vm.usersWithRoles = data.userwithrole;
			});
		}
		
		function assignRoleToMultipleUsers(){
			if($scope.selectRole == 'selectRole'){
				toastr.error('Please select role');
				document.getElementById('selectRole').focus();
				return;
			}
			var idsArr = [];
			var flag = true;
			for(var i = 0; i < vm.usersWithoutRoles.length; i++){
				if(vm.usersWithoutRoles[i].select){
					vm.usersWithoutRoles[i].select = false;
					var obj = {
							id : vm.usersWithoutRoles[i].id
					}
					idsArr.push(obj);
					flag = false;
				}
			}
			
//			var roleArray = idsArr.concat(vm.userRolesList);
			
			if(flag){
				toastr.error('Please select user to assign role');
				return;
			}
			
			var role = JSON.parse($scope.selectRole);
			var sendObj = {
				roleId	:	role.id,
				name	:	role.roleName,
				user	:	idsArr	//roleArray
		    }
			
			userToRoleService.assign1RoleToMultipleUsers(sendObj).then(function(){
				toastr.success('Role added successfully');
				changeRole($scope.selectRole);
			});
		}
		
		function removeRoleOfMultipleUsers(){
			if($scope.selectRole == 'selectRole'){
				toastr.error('Please select role');
				document.getElementById('selectRole').focus();
				return;
			}
			var idsArr = [];
			var flag = true;
			for(var i = 0; i < vm.usersWithRoles.length; i++){
				if(vm.usersWithRoles[i].select){
					vm.usersWithRoles[i].select = false;
					var obj = {
							id : vm.usersWithRoles[i].id
					}
					idsArr.push(obj);
					flag = false;
				}else{
//					flag = false;
//					vm.usersWithRoles[i].select = false;
				}
			}
			
			if(flag){
				toastr.error('Please select user to remove role');
				return;
			}
			var role = JSON.parse($scope.selectRole);
			var sendObj = {
					roleId	:	role.id,
					name	:	role.roleName,
					user	:	idsArr	//roleArray
			}
			
			userToRoleService.removeRoleOfMultipleUsers(sendObj).then(function(){
				toastr.success('Roles removed successfully');
				changeRole($scope.selectRole);
			});
		}
		
	}

})();
