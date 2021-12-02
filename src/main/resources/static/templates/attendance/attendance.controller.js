/**
 * @author : Anurag
 * @name : Attendance Controller
 * @description : controller for Attendance module
 * @date : 29/06/2019
 */

(function () {
	"use strict";

	angular
		.module("myApp.attendance")
		.controller("attendanceController", attendanceController);
	attendanceController.$inject = [
		"$state",
		"$scope",
		"toastr",
		"DTColumnDefBuilder",
		"DTOptionsBuilder",
		"genericFactory",
		"localStorageService",
		"ApiEndpoint",
		"$filter"
	];

	/* @ngInject */
	function attendanceController(
		$state,
		$scope,
		toastr,
		DTColumnDefBuilder,
		DTOptionsBuilder,
		genericFactory,
		localStorageService,
		ApiEndpoint,
		$filter
	) {
		var loginUser = localStorageService.get(ApiEndpoint.userKey);
		var attendance = staticUrlAttendance + "/attendance";
		var employee = staticUrlAttendance + "/employees";

		$scope.showTableData = false;
		var selectedDataCounter = 0;
		$scope.showBtns = false;
		
		var vm = angular.extend(this, {
			selectAllChk: false,
		});


		/**
		 * @author : Anurag
		 * @description : fetch departments on load
		 * @date : 01/07/2018
		 */
		$scope.fetchDepartments = function () {
			var msg = "Departments Load....', 'Successful !!";
			var url = employee + "/deptList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.depts = response.data;
				// console.log(JSON.stringify($scope.depts));
			});
		};

		/**
		 * @author : Anurag
		 * @description : fetch attendance and employees on Date Selection and submit
		 * @date : 01/07/2018
		 */
		$scope.showAttendanceList = function () {
			if ($scope.selectedDept == null || $scope.selectedDate == null) {
				toastr.error("Please select both fields");
				return;
			}
			vm.selectAllChk = false;
			$scope.showBtns = false;
			var msg = "Employee Load....', 'Successful !!";
			var url = employee + "/employeeByDept?deptName=" + $scope.selectedDept;

			genericFactory.getAll(msg, url).then(function (response) {
				$scope.employees = response.data;
				for (var i = 0; i < $scope.employees.length; i++) {
					$scope.employees[i].inTime = "";
					$scope.employees[i].outTime = "";
					$scope.employees[i].present = true;
					$scope.employees[i].left = false;
					$scope.employees[i].edit = true;
					$scope.employees[i].editing = false;
					$scope.employees[i].check = vm.selectAllChk;
				}

				var msg = "Attendance Load....', 'Successful !!";
				var date = $filter("date")($scope.selectedDate, "MM/dd/yyyy");
				var today = $filter("date")(new Date(), "MM/dd/yyyy");
				if (date == today) {
					$scope.isToday = false;
				} else {
					$scope.isToday = true;
				}

				var url = attendance + "/attendanceByDate?date=" + date;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.attendanceList = response.data;
					if ($scope.attendanceList != null) {
						for (var i = 0; i < $scope.employees.length; i++) {
							for (var j = 0; j < $scope.attendanceList.length; j++) {
								if (
									$scope.attendanceList[j].employeeMst.empId ==
									$scope.employees[i].empId
								) {
									$scope.employees[i].isPresent = $scope.attendanceList[j].isPresent;
									$scope.employees[i].attId = $scope.attendanceList[j].attId;
									$scope.employees[i].inTime = $scope.attendanceList[j].inTime;
									$scope.employees[i].status = $scope.attendanceList[j].status;
									if($scope.employees[i].status == "Present"){
										$scope.employees[i].style = {"color": "#1DE9B6"};
									}else{
										$scope.employees[i].style = {"color":"#FF5733"};
									}
									if ($scope.attendanceList[j].inTime != null || $scope.employees[i].status == "Absent"){
										$scope.employees[i].present = false;
									}
									$scope.employees[i].outTime = $scope.attendanceList[j].outTime;
									if ($scope.attendanceList[j].outTime != null || $scope.employees[i].status == "Absent") {
										$scope.employees[i].left = true;
									}
								}
							}
						}
					}
					$scope.showTableData = true;
				});
			});
		};
		
		/**
		 * @author : Anurag
		 * @Description : select all data on click of Select All checkbox
		 * @date : 23/07/2019
		 */
		$scope.selectAllTable = function () {
			for (var index in $scope.employees) {
				$scope.employees[index].check = vm.selectAllChk;
			}
			if (vm.selectAllChk) {
				selectedDataCounter = $scope.employees.length;
				$scope.showBtns = true;
			}
			else {
				selectedDataCounter = 0;
				$scope.showBtns = false;
			}
		}
		
		/**
		 * @author : Anurag
		 * @Description : select single employee or multiple and show buttons
		 * @date : 23/07/2019
		 */
		$scope.showPresentBtn = function(index, arr){
			$scope.employees[index].check = !$scope.employees[index].check;

			if ($scope.employees[index].check == true) {
				selectedDataCounter++;
			} else
				selectedDataCounter--;

			if (selectedDataCounter == $scope.employees.length)
				vm.selectAllChk = true;
			else {
				vm.selectAllChk = false;
			}

			if (selectedDataCounter == 0)
				$scope.showBtns = false;
			else
				$scope.showBtns = true;
		}

		/**
		 * @author : Anurag
		 * @Description : multiple present recording
		 * @date : 23/07/2019
		 */
		$scope.multiPresent = function(){
			var cellSelectedArr = [];
			for (var index = 0; index < $scope.employees.length; index++) {
				if ($scope.employees[index].check) {
							var newArr = {};
							newArr.employeeMst = $scope.employees[index];
							newArr.attDate = $filter("date")($scope.selectedDate, "MM/dd/yyyy");
							newArr.inTime = $scope.employees[index].inTime;
							newArr.outTime = $scope.employees[index].outTime;
							newArr.status = "Present";
							newArr.isPresent = 1;
							newArr.updUserId = loginUser.id;
							newArr.updDateTime = $filter("date")(
								new Date(),
								"dd/MM/yyyy - h:mm:ss a"
							);
							newArr.active = 1;
							
							cellSelectedArr.push(newArr);
						}
				if (index + 1 == $scope.employees.length) {
					var msg = "Saving Presents";
					var url = attendance + "/multiEntry";
//					 console.log(JSON.stringify(cellSelectedArr))
					genericFactory.add(msg, url, cellSelectedArr).then(function (response) {
						$scope.showAttendanceList();
						selectedDataCounter = 0;
					});					
				}
			}
		}
		
		/**
		 * @author : Anurag
		 * @Description : multiple absent recording
		 * @date : 23/07/2019
		 */
		$scope.multiAbsent = function(){
			var cellSelectedArr = [];
			for (var index = 0; index < $scope.employees.length; index++) {
				if ($scope.employees[index].check) {
							var newArr = {};
							newArr.employeeMst = $scope.employees[index];
							newArr.attDate = $filter("date")($scope.selectedDate, "MM/dd/yyyy");
							newArr.inTime = null;
							newArr.outTime = null;
							newArr.status = "Absent";
							newArr.isPresent = 0;
							newArr.updUserId = loginUser.id;
							newArr.updDateTime = $filter("date")(
								new Date(),
								"dd/MM/yyyy - h:mm:ss a"
							);
							newArr.active = 1;
							
							cellSelectedArr.push(newArr);
						}
				if (index + 1 == $scope.employees.length) {
					var msg = "Saving Absentees";
					var url = attendance + "/multiEntry";
					 console.log(JSON.stringify(cellSelectedArr))
					genericFactory.add(msg, url, cellSelectedArr).then(function (response) {
						$scope.showAttendanceList();
						selectedDataCounter = 0;
					});					
				}
			}
		}
		
		/**
		 * @author : Anurag
		 * @description : Add present and send to backend
		 * @date : 01/07/2018
		 */
		$scope.present = function (i, arr) {
			$scope.employees[i].inTime = new Date();
			$scope.employees[i].style = {"color": "#1DE9B6"};
			$scope.employees[i].status = "Present";

			var newArr = {};
			newArr.employeeMst = $scope.employees[i];
			newArr.attDate = $filter("date")($scope.selectedDate, "MM/dd/yyyy");
			newArr.inTime = $scope.employees[i].inTime;
			newArr.outTime = null;
			newArr.status = $scope.employees[i].status;
			newArr.isPresent = 1;
			newArr.updUserId = loginUser.id;
			newArr.updDateTime = $filter("date")(
				new Date(),
				"dd/MM/yyyy - h:mm:ss a"
			);
			newArr.active = 1;

			// console.log(JSON.stringify(newArr));

			var msg = "Adding Presence";
			var url = attendance + "/addAttendance";
			genericFactory.add(msg, url, newArr).then(function (response) {
				// console.log("Attendance saved");
				$scope.employees[i].present = false;
			});
		};

		/**
		 * @author : Anurag
		 * @description : Add leave time on leaving
		 * @date : 01/07/2018
		 */
		$scope.leaving = function (i, arr) {
			$scope.employees[i].outTime = new Date();
			$scope.employees[i].style = {"color": "#1DE9B6"};
			$scope.employees[i].status = "Present";
			
			var newArr = {};
			newArr.employeeMst = $scope.employees[i];
			newArr.attDate = $filter("date")($scope.selectedDate, "MM/dd/yyyy");
			newArr.inTime = $scope.employees[i].inTime;
			newArr.outTime = $scope.employees[i].outTime
			newArr.status = $scope.employees[i].status;
			newArr.isPresent = 1;
			newArr.updUserId = loginUser.id;
			newArr.updDateTime = $filter("date")(
				new Date(),
				"dd/MM/yyyy - h:mm:ss a"
			);
			newArr.active = 1;

			console.log(JSON.stringify(newArr));
			var msg = "Saving Out Time";
			var url = attendance + "/addAttendance";
			genericFactory.add(msg, url, newArr).then(function (response) {
				$scope.employees[i].left = true;
				$scope.employees[i].edit = true;
			});
		};
		
		/**
		 * @author : Anurag
		 * @description : Allowing edit after recording both times
		 * @date : 22/07/2018
		 */
		$scope.edit = function(i, arr){
			if(arr.status == "Absent"){
				toastr.error("Cannot Edit Absent Employee, Please set 'Present' before proceeding");
				return;
			}
			arr.edit = false;
			arr.editing = true;
			arr.editInTime = moment(arr.inTime).second(0).milliseconds(0).toDate();
			arr.editOutTime = moment(arr.inTime).second(0).milliseconds(0).toDate();
		}
		
		/**
		 * @author : Anurag
		 * @description : Save the edits made to the function
		 * @date : 22/07/2018
		 */
		$scope.save = function(i, arr){
			if(arr.editInTime == null || arr.editOutTime == null || arr.editInTime == "" || arr.editOutTime == ""){
				toastr.error("Please fill the empty fields");
				return;
			}
			var newArr = {};			
			
			newArr.employeeMst = $scope.employees[i];
			newArr.attDate = $filter("date")($scope.selectedDate, "MM/dd/yyyy");
			newArr.inTime = arr.editInTime;
			newArr.outTime = arr.editOutTime;
			newArr.status = "Present";
			newArr.isPresent = 1;
			newArr.updUserId = loginUser.id;
			newArr.updDateTime = $filter("date")(
				new Date(),
				"dd/MM/yyyy - h:mm:ss a"
			);
			newArr.active = 1;

			console.log(JSON.stringify(newArr));
			var msg = "Saving Out Time";
			var url = attendance + "/addAttendance";
			genericFactory.add(msg, url, newArr).then(function (response) {
				arr.edit = true;
				arr.editing = false;
				arr.inTime = arr.editInTime;
				arr.outTime = arr.editOutTime;
			});
			
		}

		/**
		 * @author : Anurag
		 * @Description : init controller
		 * @date : 18/06/2018
		 */
		var init = function () {
			$scope.fetchDepartments();
			$scope.isNewEmployee = false;
			$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM(
				'C<"clear">lfrtip'
			);
			$scope.dtColumnDefs = [
				DTColumnDefBuilder.newColumnDef(4).notSortable(),
				DTColumnDefBuilder.newColumnDef(4).notSortable()
			];
		};
		init();
	}
})();
