(function(){
	'use strict';

	angular.module('myApp.home',[

		])
	.config(function($stateProvider){
		$stateProvider
		.state('main.home', {
            url: "/home",
            views: {
                "sub": {templateUrl: "templates/home/home.html",
                		controller : "HomeController as vm"}
            }
        })
	});

})();