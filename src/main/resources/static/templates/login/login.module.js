(function(){
	'use strict';

	angular.module('myApp.login',[

		])
	.config(function($stateProvider){
		$stateProvider
		.state('login', {
            url: "/login",
            views: {
                "main":
                 {
                 	templateUrl: "templates/login/login.html",
                 	controller: "loginController as vm"
                 }
            }
        })
	});

})();