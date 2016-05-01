App.controller('reservationsCtrl', function($scope,FlightsSrv,$location) {

	$scope.isCollapsed = true;

    function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
    }
    $scope.hidden = true;
    $scope.hidden2 = true;
	$scope.search = function()
	{
		FlightsSrv.setSelectedBookingRefNumber($scope.selectedBookingRefNumber);

		FlightsSrv.getMyReservation().success(function(reservations){
			if(reservations === "")
			{
				alert("Invalid Booking Reference Number");
			}
			else
			{				
				if(reservations.outFlight!=null)
				{
					$scope.origin = reservations.outFlight.origin ;
					$scope.destination = reservations.outFlight.destination ;
					$scope.flightNumber = reservations.outFlight.flightNumber;
					$scope.cabin = reservations.cabin;
					$scope.seatNumber = reservations.seat;//reservations[0].
					var d = new Date(reservations.outFlight.date);
					$scope.departureTime = d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate()+" "+addZero(d.getHours())+":"+addZero(d.getMinutes()) ;
					$scope.hidden = false;
				}
				if(reservations.returnFlight!=null)
				{
					$scope.origin2 = reservations.returnFlight.origin ;
					$scope.destination2 = reservations.returnFlight.destination ;
					$scope.flightNumber2 = reservations.returnFlight.flightNumber;
					$scope.cabin2 = reservations.cabin;
					$scope.seatNumber2 = reservations.seat;//reservations[0].
					var d2 = new Date(reservations.returnFlight.date);
					$scope.departureTime2 = d2.getFullYear()+"/"+(d2.getMonth()+1)+"/"+d2.getDate()+" "+addZero(d2.getHours())+":"+addZero(d2.getMinutes()) ;
					$scope.hidden2 = false;
				}
				$scope.isCollapsed = !$scope.isCollapsed;
			}
		});
	}
});