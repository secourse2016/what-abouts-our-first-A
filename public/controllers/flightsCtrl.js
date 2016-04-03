App.controller('flightsCtrl',function($scope,FlightsSrv,$location){
    $scope.return = function() {
    $location.url('/flights2');
    };

    $scope.origin = FlightsSrv.getSelectedOriginAirport();
    $scope.destination = FlightsSrv.getSelectedDestinationAirport();

    function Flights() {
    FlightsSrv.getFlights().success(function(flights) {
	     $scope.Flights = flights;
     });
    };
    Flights();
})
