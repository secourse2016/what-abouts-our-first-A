App.controller('reservationsCtrl', function($scope,FlightsSrv,$location) {

	$scope.isCollapsed = true;

	$scope.search = function()
	{
		$scope.isCollapsed = !$scope.isCollapsed;
	}
});