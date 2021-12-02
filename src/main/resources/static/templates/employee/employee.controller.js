/**
 * @author : Anurag
 * @name : employeeController
 * @description : controller for Employee module
 * @date : 18/06/2019
 */

(function() {
	'use strict';

	angular.module('myApp.employee').controller('employeeController', employeeController);
	employeeController.$inject = [ '$state', '$scope', 'toastr',
			'DTColumnDefBuilder', 'DTOptionsBuilder','genericFactory','localStorageService','ApiEndpoint','$filter' ];

	/* @ngInject */
	function employeeController($state, $scope, toastr,
			DTColumnDefBuilder, DTOptionsBuilder, genericFactory,localStorageService,ApiEndpoint,$filter) {
		
		var loginUser = localStorageService.get(ApiEndpoint.userKey);																	
		var employee = staticUrlAttendance + '/employees';
		var tempEmpId = 0;
		$scope.employeeFormOpen = false;
		$scope.employeeTable = true;
		$scope.deptFormOpen = false;
		$scope.skillFormOpen = false;
		$scope.isNewDept = false;
		$scope.isNewSkill = false;
		
		/**
		 * @author : Anurag
		 * @description : fetch employees on load.
		 * @date : 18/06/2018
		 */
		$scope.fetchEmployees = function() {
			var msg = "Employees Load....', 'Successful !!";
            var url = employee+"/employeesList";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.employees = response.data;
                    for(var i=0; i<$scope.employees.length; i++)
                    	$scope.employees[i].flag = false;
            });
		}
		
		/**
		 * @author : Anurag
		 * @description : fetch skills on load.
		 * @date : 18/06/2018
		 */
		$scope.fetchSkills = function() {
			var msg = "Skills Load....', 'Successful !!";
            var url = employee+"/skillList";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.skills = response.data;
//                    console.log(JSON.stringify($scope.skills));
            });

		}		
		
		/**
		 * @author : Anurag
		 * @description : fetch titles on load
		 * @date : 19/06/2018
		 */
		$scope.fetchTitles = function() {
			var msg = "Skills Load....', 'Successful !!";
            var url = employee+"/titleList";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.titles = response.data;
//                    console.log(JSON.stringify($scope.titles));
            });
		}

		/**
		 * @author : Anurag
		 * @description : fetch departments on load
		 * @date : 01/07/2018
		 */
		$scope.fetchDepartments = function() {
			var msg = "Departments Load....', 'Successful !!";
            var url = employee+"/deptList";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.depts = response.data;
//                    console.log(JSON.stringify($scope.titles));
            });
		}

		/**
		 * @author : Anurag
		 * @description : show EmployeeForm
		 * @date : 19/06/2018
		 */
		$scope.showEmployeeForm = function(){
			$scope.isNewEmployee = true;
			$scope.employeeFormOpen = true;
			$scope.deptFormOpen = true;
			$scope.skillFormOpen = true;
			$scope.showBtn = true;
			for(var i=0; i<$scope.employees.length; i++)
				$scope.employees[i].flag = false;
			$scope.title = "";
			$scope.firstName = "";
			$scope.lastName = "";
			$scope.gender = "";
			$scope.designation = "";
			$scope.skill = "";
			$scope.dept = "";
			$scope.emailId = "";
			$scope.contactNo = "";			
			$scope.dateOfBirth = "";
			$scope.dateOfJoining = "";
			$scope.nationality = "";
			$scope.bloodGroup = "";
			$scope.aadharNo = "";
			$scope.isHandicap = "";
			$scope.rfId = "";
		}

		/**
		 * @author : Anurag
		 * @description : show DeptForm
		 * @date : 01/07/2018
		 */
		$scope.showDeptForm = function(){
			$scope.employeeFormOpen = true;
			$scope.deptFormOpen = true;
			$scope.skillFormOpen = true;
			$scope.employeeTable = false;
			$scope.isNewDept = true;
		}
		 /**
		 * @author : Anurag
		 * @description : show SkillForm
		 * @date : 01/07/2018
		 */
		$scope.showSkillForm = function(){
			$scope.employeeFormOpen = true;
			$scope.deptFormOpen = true;
			$scope.skillFormOpen = true;
			$scope.employeeTable = false;
			$scope.isNewSkill = true;
		}

		/**
		 * @author : Anurag
		 * @description : Cancel EmployeeForm
		 * @date : 19/06/2018
		 */
		$scope.cancelAdd = function(){
			$scope.isNewEmployee = false;
			$scope.isNewDept = false;
			$scope.isNewSkill = false;
			$scope.employeeTable = true;

			$scope.employeeFormOpen = false;
			$scope.deptFormOpen = false;
			$scope.skillFormOpen = false;

			$scope.updBtn = false;
			$scope.title = "";
			$scope.newDeptName = "";
			$scope.newSkillName = "";

			for(var i=0;i<$scope.employees.length;i++){
				$scope.employees[i].flag = false;
			}
		}
		
		/**
		 * @author : Anurag
		 * @description : add an employee
		 * @date : 19/06/2018
		 */
		$scope.addEmployee = function(){
			var newArr = {};
			
			//newArr.empCode = "JC" + Math.floor(1000 + Math.random() * 9000); //Placeholder - needs update from client
			if ($scope.rfId == undefined || $scope.rfId == null) {
				toastr.error('RF ID Number is Compulsory..!');
				return;
			}
			
			newArr.empCode = "JC" + $scope.rfId;
			for(var i=0;i<$scope.titles.length;i++){
				if($scope.titles[i].titleName === $scope.title)
				newArr.titleMst = $scope.titles[i];
			}
			newArr.firstName = $scope.firstName;
			newArr.lastName = $scope.lastName;
			for(var i=0;i<$scope.depts.length;i++){
				if($scope.depts[i].deptName === $scope.dept)
				newArr.deptMst = $scope.depts[i];
			}
			newArr.gender = $scope.gender;
			
			newArr.designation = $scope.designation;
			for(var i=0;i<$scope.skills.length;i++){
				if($scope.skills[i].skillName === $scope.skill)
				newArr.skillMst = $scope.skills[i];
			}
			newArr.emailId = $scope.emailId;
			newArr.contactNo = $scope.contactNo;
			
			newArr.dateOfBirth = $scope.dateOfBirth;
			newArr.dateOfJoining = $scope.dateOfJoining;
			newArr.nationality = $scope.nationality;
			newArr.bloodGroup = $scope.bloodGroup;
			
			newArr.aadharNo = $scope.aadharNo;
			newArr.isHandicap = $scope.isHandicap;
			newArr.rfId = $scope.rfId;
			
			newArr.empEntryDate = new Date();
			newArr.updUserId = loginUser.id;
			newArr.updDateTime = $filter('date')(new Date(),'dd/MM/yyyy - h:mm:ss a');
			newArr.active = 1;

			
			var msg = "Saving New Employee";
	    	var url = employee+"/addEmployee";
	    	genericFactory.add(msg,url,newArr).then(function(response){
	    		$scope.isNewEmployee = false;
				$scope.employeeFormOpen = false;
				$scope.deptFormOpen = false;
				$scope.skillFormOpen = false;				
				$scope.fetchEmployees();
	    	});
		}
		
		/**
		 * @author : Anurag
		 * @description : add Department
		 * @date : 01/07/2018
		 */
		$scope.addDept = function(){
			var newArr = {};

			for(var i = 0;i<$scope.depts.length;i++){
				if($scope.newDeptName == $scope.depts[i].deptName){
					toastr.error("Department already exists");
					return
				}
			}
			newArr.deptName = $scope.newDeptName;
			newArr.deptDesc = null;

			var msg = "Saving New Department";
	    	var url = employee+"/addDept";
	    	genericFactory.add(msg,url,newArr).then(function(response){		
				$scope.fetchDepartments();
				$scope.newDeptName = "";
	    	});
		}

		 /**
		 * @author : Anurag
		 * @description : add Skill
		 * @date : 01/07/2018
		 */
		$scope.addSkill = function(){
			var newArr = {};

			for(var i = 0;i<$scope.skills.length;i++){
				if($scope.newSkillName == $scope.skills[i].deptName){
					toastr.error("Skill already exists");
					return;
				}
			}
			newArr.skillName = $scope.newSkillName;
			newArr.skillCode = makeCode(3);

			var msg = "Saving New Skill";
	    	var url = employee+"/addSkill";
	    	genericFactory.add(msg,url,newArr).then(function(response){				
				$scope.fetchSkills();
				$scope.newSkillName = "";
	    	});
		}

		/**
		 * @author : Anurag
		 * @description : Generate Random Code
		 * @date : 01/07/2018
		 */
		function makeCode(length) {
			var result           = '';			
			var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var charactersLength = characters.length;
			for ( var i = 0; i < length; i++ ) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			result += Math.floor(100 + Math.random() * 900);
			return result;
		}
		
		/**
		 * @author : Anurag
		 * @description : show modify/update buttons
		 * @date : 19/06/2018
		 */
		$scope.modify = function(i){
			$scope.employees[i].flag= true;
		}
		
		/**
		 * @author : Anurag
		 * @description : show the Employee fields that require update
		 * @date : 19/06/2018
		 */
		$scope.updateEmployeeForm = function(i, arr){
			$scope.showBtn = false;
			$scope.isNewEmployee = true;
			$scope.employeeFormOpen = true;
			$scope.updBtn = true;
			tempEmpId = arr.empId;
			
			$scope.title = arr.titleMst.titleName;
			$scope.firstName = arr.firstName;
			$scope.lastName = arr.lastName;
			$scope.dept = arr.deptMst.deptName;
			$scope.gender = arr.gender;

			$scope.designation = arr.designation;
			$scope.skill = arr.skillMst.skillName;			
			$scope.emailId = arr.emailId;
			$scope.contactNo = arr.contactNo;
			
			$scope.dateOfBirth = new Date(arr.dateOfBirth);
			$scope.dateOfJoining = new Date(arr.dateOfJoining);
			$scope.nationality = arr.nationality;
			$scope.bloodGroup = arr.bloodGroup;
			
			$scope.aadharNo = arr.aadharNo;
			$scope.isHandicap = arr.isHandicap;
			$scope.rfId = arr.rfId;
		}
		
		/**
		 * @author : Anurag
		 * @description : save the updates
		 * @date : 19/06/2018
		 */
		$scope.updateEmployee = function(){	

			var newArr = {};
			newArr.empId = tempEmpId;
			newArr.empCode = "JC" + $scope.rfId;  //Placeholder - needs update from client
			for(var i=0;i<$scope.titles.length;i++){
				if($scope.titles[i].titleName === $scope.title)
				newArr.titleMst = $scope.titles[i];
			}
			newArr.firstName = $scope.firstName;
			newArr.lastName = $scope.lastName;
			for(var i=0;i<$scope.depts.length;i++){
				if($scope.depts[i].deptName === $scope.dept)
				newArr.deptMst = $scope.depts[i];
			}
			newArr.gender = $scope.gender;
			
			newArr.designation = $scope.designation;
			for(var i=0;i<$scope.skills.length;i++){
				if($scope.skills[i].skillName === $scope.skill)
				newArr.skillMst = $scope.skills[i];
			}
			newArr.emailId = $scope.emailId;
			newArr.contactNo = $scope.contactNo;
			
			newArr.dateOfBirth = $scope.dateOfBirth;
			newArr.dateOfJoining = $scope.dateOfJoining;
			newArr.nationality = $scope.nationality;
			newArr.bloodGroup = $scope.bloodGroup;
			
			newArr.aadharNo = $scope.aadharNo;
			newArr.isHandicap = $scope.isHandicap;
			newArr.rfId = $scope.rfId;

			newArr.updUserId = loginUser.id;
			newArr.updDateTime = $filter('date')(new Date(),'dd/MM/yyyy - h:mm:ss a');
			newArr.active = 1;
			
			var msg = "Updated Employee";
	    	var url = employee+"/addEmployee";
	    	genericFactory.add(msg,url,newArr).then(function(response){
	    		$scope.isNewEmployee = false;
				$scope.employeeFormOpen = false;
				$scope.deptFormOpen = false;
				$scope.skillFormOpen = false;
				$scope.updBtn = false;
				$scope.fetchEmployees();
	    	});
		}
		
		/**
		 * @author : Anurag
		 * @description : Delete an employee
		 * @date : 19/06/2018
		 */
		$scope.deleteEmp = function(i, arr){
			var msg = "Deleting Employee";
	    	var url = employee+"/delEmployee";
	    	genericFactory.delet(msg,url,arr).then(function(response){
	    		$scope.employees[i].flag= false;
				$scope.fetchEmployees();
	    	});
		}

		/**
		 * @author : Anurag
		 * @Description : init controller
		 * @date : 18/06/2018
		 */
		var init = function() {
			$scope.fetchEmployees();
			$scope.fetchSkills();
			$scope.fetchTitles();
			$scope.fetchDepartments();
			$scope.isNewEmployee = false;
			$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM(
					'C<"clear">lfrtip');
			$scope.dtColumnDefs = [
					DTColumnDefBuilder.newColumnDef(2).notSortable(),
					DTColumnDefBuilder.newColumnDef(2).notSortable() ];
		}
		init();

	}
})();
