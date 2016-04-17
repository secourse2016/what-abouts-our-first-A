App.controller('reservationsCtrl', function($scope,FlightsSrv,$location) {

	$scope.isCollapsed = true;

	$scope.search = function()
	{
		FlightsSrv.setSelectedBookingRefNumber($scope.selectedBookingRefNumber);
		FlightsSrv.getMyReservation().success(function(reservation){
			$scope.origin = reservation.origin ;
			$scope.destination = reservation.destination ;
			$scope.cabin = reservation.
			$scope.flightNumber = reservation.flightNumber ;
			$scope.seatNumber = reservation.
			$scope.duration = reservation.duration ;
			$scope.departureTime = reservation.date ;
			// $scope.arrivalTime = reservation.
		});
		$scope.isCollapsed = !$scope.isCollapsed;
	}
});