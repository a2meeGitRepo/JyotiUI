(function () {
	'use strict';

	angular
		.module('myApp.scrap')
		.factory('scrapHttpService', scrapHttpService);

	scrapHttpService.$inject = ['$http', '$q', '_', 'localStorageService', 'ApiEndpoint'];

	/* @ngInject */
	function scrapHttpService($http, $q, _, localStorageService, ApiEndpoint) {
		
		var user = localStorageService.get(ApiEndpoint.userKey);
		var scrapUrl = staticUrlScrap+"/scrapentery";   // User Url
		
		// Variables
		var users = {};

		var service = {
			getScraps : getScraps,
			getDepartmentsList	:	getDepartmentsList,
			getScrapTypeList	:	getScrapTypeList,
			createNewTicket		:	createNewTicket,
			getYardDepartmentList	:	getYardDepartmentList,
			changeDepartmentStatus	:	changeDepartmentStatus,
			changeYardStatus	:	changeYardStatus,
			updateYard	:	updateYard,
			getScrapDeparmentListDateWise	:	getScrapDeparmentListDateWise
		};

		return service;
	
		
		function getScraps(){
			return $http.get(scrapUrl+'/list');
		}
		
		function getDepartmentsList(){
//			/scrapdepartment/list
			return $http.get(staticUrlScrap+'/scrapdepartment/list');
		}
		
		function getScrapTypeList(){
			return $http.get(staticUrlScrap+'/scrapitem/list');
		}
		
		function createNewTicket(iObj){
			//localhost:8090/scrapentery/create
			return $http.post(scrapUrl+'/create',iObj);
		}
		
		function getYardDepartmentList(){
			return $http.get(staticUrlScrap + '/yarddepartment/list');
		}
		
		function changeDepartmentStatus(iObj){
			//localhost:8090/scrapentery/getlist?ticket_no=adi123&status=approve
			return $http.get(scrapUrl + '/getListbyStatus?ticket_no=' + iObj.ticket_no + '&status=' + iObj.status);
		}
		
		function changeYardStatus(iObj){
			//localhost:8090/yarddepartment/updatestatus?ticket_no=wwww&status=reject
			return $http.get(staticUrlScrap + '/yarddepartment/getListbyStatus?ticket_no=' + iObj.ticket_no + '&status=' + iObj.status);
		}
		
		function updateYard(iObj){
			return $http.post(staticUrlScrap + '/yarddepartment/create', iObj);
		}
		
		function getScrapDeparmentListDateWise(obj){
//			http://localhost:8090/scrapentery/scrapEntryByToDNFromD?startDate=2018-10-19&endDate=2018-10-19
			return $http.get(scrapUrl + '/scrapEntryByToDNFromD?startDate=' + obj.startDate + '&endDate=' + obj.endDate);
		}
		
		
	}
})();
