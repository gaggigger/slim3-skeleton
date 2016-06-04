myControllers.controller('SidebarCtrl', ['$scope', '$rootScope', '$location', function($scope, $rootScope, $location) {

	$scope.currentUser.fullname = $rootScope.currentUser.fullname;
	$scope.currentUser.groups = $rootScope.currentUser.groups;
	
	$scope.isActive = function (viewLocation) {
		return (viewLocation === $location.path());
	};
	
}]);
