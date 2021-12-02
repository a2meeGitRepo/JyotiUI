(function() {
	'use strict';
	angular.module('myApp.storageBin', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.storageBin', {
//			abstract : true,
			url : "/putAway",
			views : {
				"sub" : {
					templateUrl: 'templates/storageBin/storageBin.html',
					controller : "storageBinController as vm"
				}
			}
		})
	});
})();