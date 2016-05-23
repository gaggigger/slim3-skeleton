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
