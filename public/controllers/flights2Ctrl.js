App.controller('flights2Ctrl',function($scope,FlightsSrv,$location){
    $scope.return = function() {
        $location.url('/');
    };

    $scope.origin = FlightsSrv.getSelectedOriginAirport();
    $scope.destination = FlightsSrv.getSelectedDestinationAirport();
    
    $scope.setReturnFlight=function(flight,price){
        FlightsSrv.setReturnFlight(flight);
        FlightsSrv.setReturnPrice(price);
        $location.url('/confirm');
    }

    function Flights() {
    FlightsSrv.getFlights().success(function(flights) {
	     $scope.Flights = flights;
     });
    };
    Flights();
})
