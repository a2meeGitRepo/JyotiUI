/**
  * @author 		: ABS
  * @name			: materialIssueController
  * @description 	: controller for material issue module
  * @date 			: 20/06/2018
  */
(function() {
	'use strict';

	angular.module('myApp.roleManagement').controller('roleManagementController', roleManagementController);

	roleManagementController.$inject = ['$state', '$scope', 'roleManagementService','toastr', '$compile', 'userToRoleService','DTColumnDefBuilder', 'DTOptionsBuilder'];
	/* @ngInject */
	function roleManagementController($state, $scope, roleManagementService, toastr, $compile, userToRoleService,DTColumnDefBuilder, DTOptionsBuilder) {
		
		var vm = angular.extend(this, {
			roleDetailsList : [],
			permissionsList : [],
			addNewRowInTable : addNewRowInTable,
			assignPermissionsToRole : assignPermissionsToRole,
			activeDeactive : activeDeactive,
			getSelect : getSelect,
			manageUserRole : manageUserRole
//			save : save
		});

		(function activate() {
			$('.loading').show();
			loadAllPermissions();
			loadAllRoleDetails();
		})();
		
		function loadAllRoleDetails(){
			userToRoleService.getAllRoleDetails().then(function(data){
				vm.roleDetailsList = data;
				console.log("JSONcccc"+JSON.stringify(vm.roleDetailsList))
				$('.loading').hide();
			});
		}
		
		function getSelect(permissions, userPermissions){
			for(var i = 0; i < userPermissions.permission.length; i++){
				if(permissions.permissionId == userPermissions.permission[i].permissionId){
					return true;
				}
			}
		}
		
		function manageUserRole(permissions, userPermissions){
			var flag = true;
			for(var i = 0; i < userPermissions.permission.length; i++){
				if(permissions.permissionId == userPermissions.permission[i].permissionId){
					userPermissions.permission.splice(i,1);
					flag = false;
				}
			}
			
			if(flag){
				var obj = Object.assign({}, permissions);
				obj.type= 'E';
				obj.permission = obj.name;
				delete obj.name;
				delete obj['@id'];
				
				userPermissions.permission.push(obj);
			}
		}
		
		function loadAllPermissions(){
			roleManagementService.getAllPermissionList().then(function(data){
				vm.permissionsList = data;
			});
		}
		
		function addNewRowInTable(){
			
			var obj = {
			        roleName: "",
			        permission: []
			 };
			vm.roleDetailsList.push(obj);
		}
		
		function assignPermissionsToRole(iObj){
			if(!iObj.roleName || iObj.roleName == ''){
				toastr.error('Role name can not be blank');
				return;
			}
			userToRoleService.assignPermission(iObj).then(function(){
				toastr.success('Permission updated successfully');
			});
		};
		
		function activeDeactive(iObj){
			iObj.active = !iObj.active;
			
			var obj = {
					roleId : iObj.id,
					activate : iObj.active
				}
			
			userToRoleService.activateDeactivateRole(obj).then(function(){
				toastr.success('done');
				loadAllPermissions();
				loadAllRoleDetails();
			});
		}

		/**
		 * @author : Anurag
		 * @Description : init controller
		 * @date : 03/10/2019
		 */
		var init = function () {
			$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM(
				'C<"clear">lfrtip')
				.withOption('responsive', true)
				.withOption('scrollX', 'auto')      
				.withOption('scrollCollapse', true)
				.withOption('autoWidth', false);
			$scope.dtColumnDefs = [
				DTColumnDefBuilder.newColumnDef(9).notSortable(),
				DTColumnDefBuilder.newColumnDef(9).notSortable()];

		}
		init();
		
	}
})();


