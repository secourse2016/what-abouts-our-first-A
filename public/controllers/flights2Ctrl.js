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

    function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
    }

    $scope.dateFixer = function (date) {
        var d = new Date(date);
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        return h + ":" + m;
    }

    $scope.addMinutes = function (date,duration) {
        var d = new Date(date);
        d.setMinutes(d.getMinutes()+parseInt(duration));
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        return h + ":" + m;
    }
})
