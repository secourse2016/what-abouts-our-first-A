App.controller('thankyouCtrl', function($scope, FlightsSrv, $location) {

	$scope.brn = FlightsSrv.brn;

	$scope.home = function() {
		$location.url('/');
	}
})