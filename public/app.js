/* ================== App Module ================== */

var myApp = angular.module('myApp', ['ui.router','myControllers','myServices','ngCookies']);
var myControllers = angular.module('myControllers', []);
var myServices = angular.module('myServices', []);
var API_SERVER = "/api";

myApp.constant("MY_CONFIG", {
		"API_LOGIN": API_SERVER + "/login",
		"API_REFRESH_TOKEN": API_SERVER + "/refreshToken",
});

myApp.run(['$state', '$rootScope', '$location', '$cookies', '$http', 'MY_CONFIG', 'AuthenticationService', function ($state, $rootScope, $location, $cookies, $http, MY_CONFIG, AuthenticationService) {
	// refresh token if it is set after page refresh
	$rootScope.currentUser = $cookies.getObject('currentUser') || false;
	if ($rootScope.currentUser) {
		$http.defaults.headers.common['Authorization'] = $rootScope.currentUser.token; //ovo stavim jer mi kod F5 na neku stranicu prvo ucita stranicu, pa onda napravi refresh
	    AuthenticationService.RefreshToken($rootScope.currentUser.token, function (response) {
			if (response.status == 'OK') {
				AuthenticationService.SetCredentials(response.user);
			} else {
				AuthenticationService.ClearCredentials();
				$state.go('login');
			}
		});
	}
	//check if user can access route on every state change (route change)
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		var requireLogin = toState.data.requireLogin;
		if (requireLogin && ($rootScope.currentUser == false)) {
			event.preventDefault();
			$state.go('login');
		}
	});
}]);

myApp.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/dashboard');
	$stateProvider
    	.state('login', {
      		url: '/login',
			controller: 'LoginCtrl',
			templateUrl: 'modules/login/login.view.html',
      		data: {
        		requireLogin: false
      		}
    	})
		.state('logout', {
      		url: '/logout',
			controller: 'LoginCtrl',
			templateUrl: 'modules/login/login.view.html',
      		data: {
        		requireLogin: false
      		}
    	})
		.state('dashboard', {
      		url: '/dashboard',
			controller: 'DashboardCtrl',
			templateUrl: 'modules/dashboard/dashboard.view.html',
      		data: {
        		requireLogin: true
      		}
    	})
});

myServices.factory('AuthenticationService', AuthenticationService);
AuthenticationService.$inject = ['$http', '$rootScope', 'MY_CONFIG', '$cookies'];

function AuthenticationService($http, $rootScope, MY_CONFIG, $cookies) {
	var service = {};

	service.Login = function (credentials, callback) {
		$http.post(MY_CONFIG.API_LOGIN, credentials)
        	.success(function (response) {
        		callback(response);
        	})
			.error(function(data, status, headers, config) {
				alert( "failure message: " + JSON.stringify({data: data}));
			});
    };

	service.RefreshToken = function (token, callback) {
		$http.post(MY_CONFIG.API_REFRESH_TOKEN, token)
        	.success(function (response) {
        		callback(response);
        	});
    };

	service.SetCredentials = function (user) {
		$rootScope.currentUser = user;
		var expire_date = new Date();
        expire_date.setDate(expire_date.getDate() + $rootScope.currentUser.valid_days);
        $cookies.putObject('currentUser', $rootScope.currentUser, {expires: expire_date});
		$http.defaults.headers.common['Authorization'] = $rootScope.currentUser.token;
    };

	service.ClearCredentials = function () {
        $rootScope.currentUser = false;
		$rootScope.menus = false;
        $cookies.remove('currentUser');
        $http.defaults.headers.common['Authorization'] = '';
    };

    return service;
};