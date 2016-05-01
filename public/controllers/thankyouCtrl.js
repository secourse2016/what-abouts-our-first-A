App.controller('thankyouCtrl', function($scope, FlightsSrv, $location) {

	$scope.brn = FlightsSrv.brn1;
	console.log(FlightsSrv.brn1)
	console.log(FlightsSrv.brn2)
	$scope.home = function() {
		$location.url('/');
	}
})