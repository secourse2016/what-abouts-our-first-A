App.controller('flightsCtrl',function($scope,FlightsSrv,$location){
    $scope.return = function() {
        $location.url('/');
    };

    $scope.origin = FlightsSrv.getSelectedOriginAirport();
    $scope.destination = FlightsSrv.getSelectedDestinationAirport();


    $scope.setDepartFlight=function(flight,price){
        FlightsSrv.setDepartFlight(flight);
        FlightsSrv.setDepartPrice(price);
        $location.url('/flights2');
    }

    function Flights() {
    FlightsSrv.getFlights().success(function(flights) {
	     $scope.Flights = flights;
     });
    };
    Flights();
})
