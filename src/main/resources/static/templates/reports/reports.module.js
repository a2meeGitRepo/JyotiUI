(function() {
	'use strict';
	angular.module('myApp.reports', ['datatables'])
	.config(function($stateProvider) {
		$stateProvider.state('main.stocksReport', {
			url : "/stocksReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/stocksReport.html',
					controller : "stocksReportController as vm"
				}
			}
		})
		.state('main.grnReport', {
			url : "/grnReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/grnReport.html',
					controller : "grnReportController as vm"
				}
			}
		})
		.state('main.deviationReport', {
			url : "/deviationReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/deviationReport.html',
					controller : "deviationReportController as vm"
				}
			}
		})
		.state('main.putAwayReport', {
			url : "/putAwayReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/putAwayReport.html',
					controller : "putAwayReportController as vm"
				}
			}
		})
		.state('main.pickingReport', {
			url : "/pickingReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/pickingReport.html',
					controller : "pickingReportController as vm"
				}
			}
		})
		.state('main.transactionReport', {
			url : "/transactionReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/transactionReport.html',
					controller : "transactionReportController as vm"
				}
			}
		})
		.state('main.pendingReport', {
			url : "/pendingReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/pendingReport.html',
					controller : "pendingReportController as vm"
				}
			}
		})
			.state('main.detailpendingReport', {
			url : "/detailpendingReport",
			views : {
				"sub" : {
					templateUrl: 'templates/reports/detailpendingReport.html',
					controller : "DetailpendingReportController as vm"
				}
			}
		})
	});
})();