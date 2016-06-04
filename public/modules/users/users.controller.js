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
