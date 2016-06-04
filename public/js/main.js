/* ================== App Module ================== */

var myApp = angular.module('myApp', ['ui.router','myControllers','myServices','ngCookies']);
var myControllers = angular.module('myControllers', []);
var myServices = angular.module('myServices', []);
var API_SERVER = "/api";

myApp.constant("MY_CONFIG", {
		"COOKIE_NAME": "slim3_skeleton_user",
		"API_LOGIN": API_SERVER + "/login",
		"API_REFRESH_TOKEN": API_SERVER + "/refreshToken",
		"API_USERS": API_SERVER + "/users",
		"API_USER_UPDATE": API_SERVER + "/userupdate",
		"API_USER_DELETE": API_SERVER + "/userdelete",
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
		.state('usersedit', {
      		url: '/users/{id:int}',
			controller: 'UsersEditCtrl',
			templateUrl: 'modules/users/users.edit.html',
      		data: {
        		requireLogin: true
      		}
    	})
		.state('usersadd', {
      		url: '/usersadd',
			controller: 'UsersAddCtrl',
			templateUrl: 'modules/users/users.add.html',
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
		$scope.data_loading = true;
		AuthenticationService.Login(credentials, function (response) {
			if (response.status == 'OK') {
				AuthenticationService.SetCredentials(response.user);
				$state.go('dashboard');
			} else {
				AuthenticationService.ClearCredentials();
				$scope.error = response.message;
				$scope.data_loading = false;
			}
		});
	};

}]);

myControllers.controller('SidebarCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

	$scope.currentUser.fullname = $rootScope.currentUser.fullname;
	$scope.currentUser.groups = $rootScope.currentUser.groups;
	
	$scope.isActive = function (viewLocation) {
		return (viewLocation === $location.path());
	};
	
}]);

myControllers.controller('UsersCtrl', ['$rootScope', '$scope', '$state', '$http', 'MY_CONFIG', 'AuthenticationService', function($rootScope, $scope, $state, $http, MY_CONFIG, AuthenticationService) {
	
	$scope.load_data = function () {
		$scope.data_loading = true;
		$http.get(MY_CONFIG.API_USERS)
			.success(function (response) {
				if (response.status == 'OK') $scope.data = response.data;
				if (response.status == 'ERROR') alert(response.message);
				if (response.status == 'AUTH ERROR') {
					AuthenticationService.ClearCredentials();
					$state.go('login');
				}
				$scope.data_loading = false;
			})
			.error(function(data, status, headers, config) {
				alert(JSON.stringify({data: data}));
				$scope.data_loading = false;
			});
	};
	
	$scope.data_loading = false;
	$scope.data = null;
	$scope.load_data();	
	
}]);

myControllers.controller('UsersEditCtrl', ['$rootScope', '$scope', '$state', '$http', 'MY_CONFIG', '$stateParams', function($rootScope, $scope, $state, $http, MY_CONFIG, $stateParams) {
	
	$scope.submit = function(data) {
		$scope.data_loading = true;
		$http.post(MY_CONFIG.API_USER_UPDATE + "/" + $stateParams.id, data)
			.success(function (response) {
				if (response.status == 'OK') $state.go('users');
				if (response.status == 'ERROR') alert(response.message);
				if (response.status == 'AUTH ERROR') {
					AuthenticationService.ClearCredentials();
					$state.go('login');
				}
				$scope.data_loading = false;
			})
			.error(function(data, status, headers, config) {
				alert(JSON.stringify({data: data}));
				$scope.data_loading = false;
			});
	}
	
	$scope.delete_user = function($id) {
		$scope.data_loading = true;
		$http.get(MY_CONFIG.API_USER_DELETE + "/" + $id)
			.success(function (response) {
				if (response.status == 'OK') $state.go('users');
				if (response.status == 'ERROR') alert(response.message);
				if (response.status == 'AUTH ERROR') {
					AuthenticationService.ClearCredentials();
					$state.go('login');
				}
				$scope.data_loading = false;
			})
			.error(function(data, status, headers, config) {
				alert(JSON.stringify({data: data}));
				$scope.data_loading = false;
			});
	}
	
	$http.get(MY_CONFIG.API_USERS + "/" + $stateParams.id)
		.success(function (response) {
			if (response.status == 'OK') $scope.form = response.data;
			if (response.status == 'ERROR') alert(response.message);
			if (response.status == 'AUTH ERROR') {
				AuthenticationService.ClearCredentials();
				$state.go('login');
			}
			$scope.form_loading = false;
		})
		.error(function(data, status, headers, config) {
			alert(JSON.stringify({data: data}));
			$scope.form_loading = false;
		});
		
	$scope.form_loading = true;
	$scope.data_loading = false;
	$scope.user_id = $stateParams.id;
}]);

myControllers.controller('UsersAddCtrl', ['$rootScope', '$scope', '$state', '$http', 'MY_CONFIG', function($rootScope, $scope, $state, $http, MY_CONFIG) {
	
	$scope.submit = function(data) {
		$scope.data_loading = true;
		$http.post(MY_CONFIG.API_USERS, data)
			.success(function (response) {
				if (response.status == 'OK') $state.go('users');
				if (response.status == 'ERROR') alert(response.message);
				if (response.status == 'AUTH ERROR') {
					AuthenticationService.ClearCredentials();
					$state.go('login');
				}
				$scope.data_loading = false;
			})
			.error(function(data, status, headers, config) {
				alert(JSON.stringify({data: data}));
				$scope.data_loading = false;
			});
	}
	
	$scope.data_loading = false;
	$scope.form = {
		username: '',
		password: '',
		first_name: '',
		last_name: '',
		email: '',
		group_admin: 0
	} //ovo moram da imam defaultnu vrijednost, jer se property na modelu kreira tek kad nesto promjenim
	
}]);
