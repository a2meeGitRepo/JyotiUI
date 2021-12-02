angular.module('myApp', [
	'ui.router',
	'LocalStorageModule',
	'angularUtils.directives.dirPagination',
	'ui.bootstrap',
	'ngJsonExportExcel',
	'toastr',
	'chart.js',
	'ngCookies',
	'ui.tinymce',
	'ngRoute',
	'ngMaterial',
	'isteven-multi-select',
	//'ngSanitize',

	'myApp.main',
	'myApp.home',
	'myApp.login',
	'myApp.generic',
	
	'myApp.purchaseOrder',
	'myApp.grn',
	'myApp.qrGrn',
	'myApp.storageBin',	
	'myApp.uploads',
	'myApp.modelPlan',
	'myApp.requestedAssm',
	'myApp.kittingArea',
	'myApp.customizeMachine',
	'myApp.requestMachine',
	'myApp.reports',
	
	'myApp.user',
	'myApp.roleToUser',
	'myApp.userToRole',
	'myApp.roleManagement',
	'myApp.employee',
	'myApp.attendance',	
	'myApp.items',
	'myApp.productionOrder',
	'myApp.supplierAndItems',
])

.value('_', window._)

.constant('ApiEndpoint', {
url: '',
userKey : 'assetManagement'
})
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }else if($location.path() == '/login' && $rootScope.globals.currentUser){
            	$location.path('/main/home');
            }
        });
    }])

.config(function($urlRouterProvider,$locationProvider) {
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/main/home');
	 // use the HTML5 History API
	 $locationProvider.hashPrefix('');
}); 