(function () {
	'use strict';

	angular
		.module('myApp.login')
		.controller('loginController', loginController);

	loginController.$inject = ['userService', '$rootScope', '$scope', '$stateParams', '$state', 'localStorageService', 'toastr', 'ApiEndpoint', 'loginFactory', '$location', '$window'];

	/* @ngInject */
	function loginController(userService, $rootScope, $stateParams, $scope, $state, localStorageService, toastr, ApiEndpoint, loginFactory, $location, $window) {

		var vm = angular.extend(this, {
			doLogin: doLogin,

		});

		(function activate() {
			$('.loading').hide();
		})();

		// ******************************************************
		function doLogin(login) {

			loginFactory.doLogin(login).then(function (response) {
				if (response.status == '200') {
					loginFactory.SetCredentials(login);
					if (response.data) {
						userService.getPermissionsOf1User(response.data.id).then(function (data) {
							console.log(JSON.stringify(data));
							sessionStorage.setItem('permissions', JSON.stringify(data));
							localStorageService.set('permissions', data)
							$location.path('/main/home');
							toastr.success('Login....', 'Succesfully !!');
						});
					}
					localStorageService.set(ApiEndpoint.userKey, response.data);
					sessionStorage.setItem(ApiEndpoint.userKey, JSON.stringify(response.data));
					// $window.location.reload();
				}else {
					console.log("EOOR")
					toastr.error('Username and Password Doesnt match...!!');
				}
			});
		}
	}
})();
