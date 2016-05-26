myControllers.controller('SidebarCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

	$scope.currentUser.fullname = $rootScope.currentUser.fullname;
	
	$scope.isActive = function (viewLocation) {
		return (viewLocation === $location.path());
	};
	
}]);
