App.controller('reservationsCtrl', function($scope,FlightsSrv,$location) {

	$scope.isCollapsed = true;

	$scope.search = function()
	{
		FlightsSrv.setSelectedBookingRefNumber($scope.selectedBookingRefNumber);
		FlightsSrv.getMyReservation.success(function(reservations){
			$scope.origin = reservation[0].origin ;
			$scope.destination = reservation[0].destination ;
			$scope.cabin = "bolla";//reservation[0]
			$scope.flightNumber = reservation[0].flightNumber ;
			$scope.seatNumber = 2;//reservation[0].
			$scope.duration = reservation[0].duration ;
			$scope.departureTime = reservation[0].date ;
			var arrivingTime = reservation[0].destination + reservation[0].duration
			$scope.arrivalTime = arrivingTime;
		});
		$scope.isCollapsed = !$scope.isCollapsed;
	}
});