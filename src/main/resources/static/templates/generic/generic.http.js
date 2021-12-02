(function () {
	'use strict';

	angular
		.module('myApp.generic')
		.factory('genericHttpFactory', genericHttpFactory);

	genericHttpFactory.$inject = ['$http', '$q', '_'];

	/* @ngInject */
	function genericHttpFactory($http, $q, _) {

		var service = {
			add : add,
			addList : addList,
			get : get,
			getAll : getAll,
			getData : getData,
			delet : delet,
			active : active,
			addReturn:addReturn,
		};

		return service;
	
		
		function getAll(url){
			return $http.get(url);
		}
		
		function getData(url,entity){
			return $http.post(url,entity);
		}
		
		function delet(url,entity){
			return $http.post(url,entity);
		}
		
		function active(url,entity){
			return $http.post(url,entity);
		}
		
		function add(url,entity){
			return $http.post(url, entity);
		}
		
		function addList(url,entities){
			return $http.post(url, entities);
		}

		function addReturn(url,entities){
			return $http.get(url,entities);
		}
		function get(url,entity_id){
			return $http.get(url+entity_id);
		}
		
	}
})();
