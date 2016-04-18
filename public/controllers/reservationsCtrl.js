App.controller('reservationsCtrl', function($scope,FlightsSrv,$location) {

	$scope.isCollapsed = true;

    function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
    }

	$scope.search = function()
	{
		FlightsSrv.setSelectedBookingRefNumber($scope.selectedBookingRefNumber);

		FlightsSrv.getMyReservation().success(function(reservations){
			$scope.origin = reservations.origin ;
			$scope.destination = reservations.destination ;
			$scope.flightNumber = reservations.number;
			$scope.cabin = reservations.cabin;
			$scope.seatNumber = "12D";//reservations[0].
			var d = new Date(parseInt(reservations.depart));
			$scope.departureTime = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()+" "+addZero(d.getHours())+":"+addZero(d.getMinutes()) ;
		});
		$scope.isCollapsed = !$scope.isCollapsed;
	}
});