(function() {
	'use strict';

	angular.module('myApp.userToRole').controller('UserToRoleController', UserToRoleController);
	UserToRoleController.$inject = [ '$state', 'userToRoleService', 'userService', '$uibModal', '$log', '$scope', 'toastr'];

	/* @ngInject */
	function UserToRoleController($state, userToRoleService, userService, $uibModal, $log, $scope, toastr) {
		var vm = angular.extend(this, {
			rolesList : [],
			tempRolesList : [],
			usersList : [],
			userRolesList : [],
			assignedUserRoles : [],
			changeUser : changeUser,
			assignRole : assignRole,
			removeRole : removeRole
		});

		(function activate() {
			vm.rolesToAssign = [];
			$scope.selectUser = 'selectUser';
			
			loadRolesList();
			loadUsers();
		})();

		
		function loadUsers(){
			userService.getUsers().then(function(data) {
				vm.usersList = data;
			});
		}

		function loadRolesList(){
			userToRoleService.getRolesList().then(function(data){
				vm.rolesList = data;
			});
		}
		
		function changeUser(iObj){
			if($scope.selectUser == 'selectUser'){
				return;
			}
			var userObject = JSON.parse(iObj);
			userService.getRoleOfUser(userObject.id).then(function(data){
				vm.userRolesList = data.roles;
				// console.log(data.roles);
				var arr = [];
				for(var i = 0; i < vm.userRolesList.length; i++){
					arr.push(vm.userRolesList[i].id);
				}
				// console.log(arr);
				vm.tempRolesList = new Array();
				for(var i = 0; i < vm.rolesList.length; i++){						
						if(arr.indexOf(vm.rolesList[i].id) == -1)
							vm.tempRolesList.push(vm.rolesList[i]);
				}
				
			});
		}
		
		function assignRole(){
			
			if($scope.selectUser == 'selectUser'){
				toastr.error('Please select user');
				document.getElementById('selectUser').focus();
				return;
			}
			var idsArr = [];
			var flag = true;
			for(var i = 0; i < vm.tempRolesList.length; i++){
				if(vm.tempRolesList[i].select){
					vm.tempRolesList[i].select = false;
					var obj = {
							roleId : vm.tempRolesList[i].id
					}
					idsArr.push(obj);
					flag = false;
				}
			}
						
			if(flag){
				toastr.error('Please select role to assign');
				return;
			}
			
			var user = JSON.parse($scope.selectUser);
			if(user.id == "001"){
				toastr.error("Admin account cannot be updated")
				return;
			}
			var sendObj = {
		        id		:	user.id,
				roles	:	idsArr	//roleArray
		    
		    }
			
			userService.assignRolesTo1User(sendObj).then(function(){
				toastr.success('Roles added successfully');
				changeUser($scope.selectUser);
			});
		}
		



		function removeRole(){
			if($scope.selectUser == 'selectUser'){
				toastr.error('Please select user');
				document.getElementById('selectUser').focus();
				return;
			}
			var idsArr = [];
			var flag = true;

			for(var i = 0; i < vm.userRolesList.length; i++){
				if(vm.userRolesList[i].select){
					vm.userRolesList[i].select = false;
					var obj = {
							roleId : vm.userRolesList[i].id
					}
					idsArr.push(obj);
					flag = false;
				}
			}
			
			if(flag){
				toastr.error('Please select role to remove');
				return;
			}
			var user = JSON.parse($scope.selectUser);
			if(user.id == "001"){
				toastr.error("Admin account cannot be updated")
				return;
			}
			var sendObj = {
		        id		:	user.id,
				roles	:	idsArr
		    
			}
			console.log(JSON.stringify(sendObj));
			
			userService.deleteRolesOf1User(sendObj).then(function(){
				toastr.success('Roles removed successfully');
				changeUser($scope.selectUser);
			});
		}

	}

})();
