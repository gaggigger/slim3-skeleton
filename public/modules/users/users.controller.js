myControllers.controller('UsersCtrl', ['$scope', '$state', '$http', 'MY_CONFIG', 'AuthenticationService', function($scope, $state, $http, MY_CONFIG, AuthenticationService) {
	
	$scope.load_data = function (page, pageSize) {
		$scope.data_loading = true;
		$http.get(MY_CONFIG.API_USERS + "/" + page + "/" + pageSize)
			.success(function (response) {
				if (response.status == 'OK') {
					$scope.data = response.data.items;
					$scope.totalItems = response.data.totalItems;
					$scope.totalPages = Math.ceil(response.data.totalItems/pageSize);
					$scope.page = page;
				}
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
	$scope.page = 1;
	$scope.pageSize = 5;
	$scope.totalItems = 0;
	$scope.load_data($scope.page, $scope.pageSize);
	
}]);

myControllers.controller('UsersEditCtrl', ['$scope', '$state', '$http', 'MY_CONFIG', '$stateParams', 'flash', function($scope, $state, $http, MY_CONFIG, $stateParams, flash) {
	
	$scope.submit_form = function(data) {
		$scope.data_loading = true;
		$http.post(MY_CONFIG.API_USER_UPDATE + "/" + $stateParams.id, data)
			.success(function (response) {
				if (response.status == 'OK') {  $state.go('users'); flash('success', response.message); }
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
	
	$scope.submit_form_pass = function(data) {
		$http.post(MY_CONFIG.API_USER_CHPASS + "/" + $stateParams.id, data)
			.success(function (response) {
				if (response.status == 'OK') {  $state.go('users'); flash('success', response.message); }
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
				if (response.status == 'OK') { $state.go('users'); flash('success', response.message); }
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

myControllers.controller('UsersAddCtrl', ['$scope', '$state', '$http', 'MY_CONFIG', 'flash', function($scope, $state, $http, MY_CONFIG, flash) {
	
	$scope.submit = function(data) {
		$scope.data_loading = true;
		$http.post(MY_CONFIG.API_USERS, data)
			.success(function (response) {
				if (response.status == 'OK') { $state.go('users'); flash('success', response.message); }
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
