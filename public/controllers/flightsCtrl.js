App.controller('flightsCtrl',function($scope,FlightsSrv,$location){
    $scope.return = function() {
        $location.url('/');
    };

    $scope.origin = FlightsSrv.getSelectedOriginAirport();
    $scope.destination = FlightsSrv.getSelectedDestinationAirport();
    $scope.departDate = FlightsSrv.getDepartDate();

    $scope.setDepartFlight=function(flight,price){
        FlightsSrv.setDepartFlight(flight);
        FlightsSrv.setDepartPrice(price);
        if(FlightsSrv.getHidden() === true){
        	$location.url('/confirm');
        }
        else {
        $location.url('/flights2');
      }
    }

    function Flights() {
    FlightsSrv.getFlights().success(function(flights) {
	     $scope.Flights = flights.outgoingFlights;
     });
    };

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
    $scope.dateFixer2 = function (date) {
        var d = new Date(date);
        var y = d.getFullYear();
        var m = d.getMonth()+1;
        var day = d.getDate();
        return day + "/" + m+ "/"+ y;
    }
    
    Flights();
})
