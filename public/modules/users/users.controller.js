myControllers.controller('UsersCtrl', ['$rootScope', '$scope', '$state', '$http', 'MY_CONFIG', 'DTOptionsBuilder', 'DTColumnBuilder', function($rootScope, $scope, $state, $http, MY_CONFIG, DTOptionsBuilder, DTColumnBuilder) {

	$scope.dtOptions = DTOptionsBuilder.newOptions().withOption('ajax', {
		url: MY_CONFIG.API_USERS + "/table",
		type: 'POST',
		beforeSend: function (request) {
			request.setRequestHeader("Authorization", $rootScope.currentUser.token);
		}
	}).withDataProp('data')
		.withOption('processing', false)
		.withOption('serverSide', true);
	$scope.dtColumns = [
        DTColumnBuilder.newColumn('id').withTitle('ID'),
        DTColumnBuilder.newColumn('username').withTitle('Username').renderWith(function(data, type, full) {
            return '<a href="/#/users/'+full.id+'">' + data + '</a>';
        }),
		DTColumnBuilder.newColumn('first_name').withTitle('First name'),
        DTColumnBuilder.newColumn('last_name').withTitle('Last name'),
		DTColumnBuilder.newColumn('email').withTitle('Email'),
		DTColumnBuilder.newColumn('group_admin').withTitle('Admin'),
		DTColumnBuilder.newColumn('created_at').withTitle('Created').withOption('bSearchable', false),
    ];

}]);

myControllers.controller('UsersEditCtrl', ['$scope', '$state', '$http', 'MY_CONFIG', '$stateParams', 'flash', function($scope, $state, $http, MY_CONFIG, $stateParams, flash) {
	
	$scope.submit_form = function(data) {
		$scope.data_loading = true;
		$http.post(MY_CONFIG.API_USER_UPDATE + "/" + $stateParams.id, data)
			.success(function (response) {
				if (response.status == 'OK') {  $state.go('users'); flash('success', response.message); }
				if (response.status == 'ERROR') $scope.errors = response.message;
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
				if (response.status == 'ERROR') $scope.errors = response.message;
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
				if (response.status == 'ERROR') $scope.errors = response.message;
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
	$scope.errors = {};
}]);

myControllers.controller('UsersAddCtrl', ['$scope', '$state', '$http', 'MY_CONFIG', 'flash', function($scope, $state, $http, MY_CONFIG, flash) {
	
	$scope.submit = function(data) {
		$scope.data_loading = true;
		$http.post(MY_CONFIG.API_USERS, data)
			.success(function (response) {
				if (response.status == 'OK') { $state.go('users'); flash('success', response.message); }
				if (response.status == 'ERROR') $scope.errors = response.message;
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
	} //ovo moram imat defaultnu vrijednost, jer se property na modelu kreira tek kad nesto promjenim
	$scope.errors = {};
	
}]);
