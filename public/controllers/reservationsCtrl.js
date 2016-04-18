App.controller('reservationsCtrl', function($scope,FlightsSrv,$location) {

	$scope.isCollapsed = true;

	$scope.search = function()
	{
		FlightsSrv.setSelectedBookingRefNumber($scope.selectedBookingRefNumber);

		FlightsSrv.getMyReservation().success(function(reservations){
			$scope.origin = reservations.origin ;
			$scope.destination = reservations.destination ;
			$scope.flightNumber = reservations.number;
			$scope.cabin = reservations.cabin;
			$scope.seatNumber = "12D";//reservations[0].
			$scope.departureTime = reservations.depart ;
		});
		$scope.isCollapsed = !$scope.isCollapsed;
	}
});