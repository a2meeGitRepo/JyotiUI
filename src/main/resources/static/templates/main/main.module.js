(function(){
	'use strict';

	angular.module('myApp.main',[

		])
	.config(function($stateProvider){
		$stateProvider
		.state('main', {
			abstract: true,
			url: "/main",
            views: {
                "main": {
                    templateUrl: "templates/main/main.html",
                    controller: "mainController as vm",
					resolve: {
						lazyLoad: ['$ocLazyLoad', function($ocLazyLoad) {
							return $ocLazyLoad.load({
								name: 'myApp',
								files: [
									'assets/js/main.js',
								]
							})
						}]
					}
                }
            }
        })
        
	});

})();