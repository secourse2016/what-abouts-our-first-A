App.controller('flights2Ctrl',function($scope,FlightsSrv,$location){
    $scope.return = function() {
        $location.url('/');
    };

    $scope.origin = FlightsSrv.getSelectedOriginAirport();
    $scope.destination = FlightsSrv.getSelectedDestinationAirport();
    $scope.returnDate = FlightsSrv.getReturnDate();

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
    $scope.convertDuration = function (duration) { 
        var hours = Math.floor(duration/60);
        var minutes = duration-(60*hours);
        return hours + "h " + minutes+"m";
    }

    $scope.getPrice = function(economy,first){
        var cabin = FlightsSrv.getCabin();
        if(cabin === "Economy"){
            return economy;
        }
        else
        {
            return first;
        }
    }

    $scope.dateFilter = function(flight)
    {
        var d = new Date(flight.date);
        if(d.getDay()===$scope.returnDate.getDay() && d.getMonth()===$scope.returnDate.getMonth() && d.getYear()===$scope.returnDate.getYear())
        {
            return true;
        }
        return false;
    };

    Flights();
})
