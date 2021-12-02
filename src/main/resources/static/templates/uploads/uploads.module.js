(function() {
	'use strict';
	angular.module('myApp.uploads', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.uploads', {
//			abstract : true,
			url : "/uploads",
			views : {
				"sub" : {
					templateUrl: 'templates/uploads/uploads.html',
					controller : "uploadsController as vm"
				}
			}
		})
	});
})();