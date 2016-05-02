App.controller('thankyouCtrl', function($scope, FlightsSrv, $location) {

	$scope.brn1 = FlightsSrv.brn1;
	$scope.airline1 = FlightsSrv.airline1;
	console.log(FlightsSrv.brn1);
	console.log(FlightsSrv.brn2);
	$scope.hidden = true;
	if(FlightsSrv.brn2 != undefined){
		$scope.airline2 = FlightsSrv.airline2;
		$scope.brn2 = FlightsSrv.brn2;
		$scope.hidden = false;
	}
	$scope.home = function() {
		$location.url('/');
	}
})