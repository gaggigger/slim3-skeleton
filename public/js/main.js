/* ================== App Module ================== */

var myApp = angular.module('myApp', ['ui.router','myControllers','myServices','ngCookies']);
var myControllers = angular.module('myControllers', []);
var myServices = angular.module('myServices', []);
var API_SERVER = "/api";

myApp.constant("MY_CONFIG", {
		"COOKIE_NAME": "slim3_skeleton_user",
		"API_LOGIN": API_SERVER + "/login",
		"API_REFRESH_TOKEN": API_SERVER + "/refreshToken",
});

myApp.run(['$state', '$rootScope', '$location', '$cookies', '$http', 'MY_CONFIG', 'AuthenticationService', function ($state, $rootScope, $location, $cookies, $http, MY_CONFIG, AuthenticationService) {
	// refresh token if it is set after page refresh
	$rootScope.currentUser = $cookies.getObject(MY_CONFIG.COOKIE_NAME) || false;
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
		.state('users', {
      		url: '/users',
			controller: 'UsersCtrl',
			templateUrl: 'modules/users/users.view.html',
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
        $cookies.putObject(MY_CONFIG.COOKIE_NAME, $rootScope.currentUser, {expires: expire_date});
		$http.defaults.headers.common['Authorization'] = $rootScope.currentUser.token;
    };

	service.ClearCredentials = function () {
        $rootScope.currentUser = false;
		$rootScope.menus = false;
        $cookies.remove(MY_CONFIG.COOKIE_NAME);
        $http.defaults.headers.common['Authorization'] = '';
    };

    return service;
};

myControllers.controller('DashboardCtrl', ['$rootScope', '$scope', '$state', '$http', 'MY_CONFIG', function($rootScope, $scope, $state, $http, MY_CONFIG) {

}]);

myControllers.controller('LoginCtrl', ['$rootScope', '$scope', '$state', 'AuthenticationService', function($rootScope, $scope, $state, AuthenticationService) {

	// reset login status, so logout on first access
	AuthenticationService.ClearCredentials();

	$scope.login = function(credentials) {
		$scope.dataLoading = true;
		AuthenticationService.Login(credentials, function (response) {
			if (response.status == 'OK') {
				AuthenticationService.SetCredentials(response.user);
				$state.go('dashboard');
			} else {
				AuthenticationService.ClearCredentials();
				$scope.error = response.message;
				$scope.dataLoading = false;
			}
		});
	};

}]);

myControllers.controller('SidebarCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

	$scope.currentUser.fullname = $rootScope.currentUser.fullname;
	
	$scope.isActive = function (viewLocation) {
		return (viewLocation === $location.path());
	};
	
}]);

myControllers.controller('UsersCtrl', ['$rootScope', '$scope', '$state', '$http', 'MY_CONFIG', function($rootScope, $scope, $state, $http, MY_CONFIG) {

}]);
