App.controller('thankyouCtrl', function($scope, FlightsSrv, $location) {

	$scope.brn = FlightsSrv.getBrn();

	$scope.home = function() {
		$location.url('/');
	}
})