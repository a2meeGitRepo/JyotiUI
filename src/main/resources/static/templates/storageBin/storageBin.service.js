(function() {
	'use strict';

	angular
		.module('myApp.storageBin')
		.factory('storageBinService', storageBinService);

	storageBinService.$inject = ['genericHttpFactory', '$q', 'toastr'];
	
	/* @ngInject */
	function storageBinService(genericHttpFactory, $q, toastr) {
		var service = {		
				addPlant	:	addPlant,
				addStorage	:	addStorage,
				
		};
		return service;

		// ***************************************************************

		function addPlant(url,entity){
			var deferred = $q.defer();
			genericHttpFactory.add(url,entity).then(function(response){
				toastr.success("Plant Added Successful...!");
				deferred.resolve(response);
			}, function(err){
				toastr.error('Plant Code is Already Exists !!');
				//toastr.error(err.status+' : '+err.statusText, 'Error !!');
			});
			return deferred.promise;
		}
		
		function addStorage(url,entity){
			var deferred = $q.defer();
			genericHttpFactory.add(url,entity).then(function(response){
				toastr.success("Store Added SuccessFul...!");
				deferred.resolve(response);
			}, function(err){
				toastr.error('Store Location is Already Exists !!');
				//toastr.error(err.status+' : '+err.statusText, 'Error !!');
			});
			return deferred.promise;
		}
		
		
	}

})();