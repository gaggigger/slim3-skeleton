myControllers.controller('SidebarCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

	$scope.currentUser.fullname = $rootScope.currentUser.fullname;
	
}]);
