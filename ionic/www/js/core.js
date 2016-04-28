/* Create Angular App Instance */
app = angular.module('United_Airlines', ['ionic','pickadate']);

/**
 * Angular Routes
 */
 app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('index', {
        url: '/',
        templateUrl: '/partials/main.html',
        controller: 'mainCtrl'
    })        

    .state('test', {
        url: '/test',
        templateUrl: '/partials/test.html',
        controller: 'mainCtrl'
    })

    .state('flights', {
        url: '/flights',
        templateUrl: '/partials/flights.html',
        controller: 'flightsCtrl'
    })
    .state('flights2', {
        url: '/flights2',
        templateUrl: '/partials/flights2.html',
        controller: 'flights2Ctrl'
    });

    $urlRouterProvider.otherwise('/#');

});

 app.controller('indexCtrl', function($scope,$state) {
    $scope.doSomething = function(){
        $state.go('index');
    }
});

app.controller('mainCtrl', function($scope, $state, FlightsSrv,$ionicModal) {
    $ionicModal.fromTemplateUrl('templates/datemodal.html', 
    function(modal) {
        $scope.datemodal1 = modal;
    },
    {
        scope: $scope, 
        animation: 'slide-in-up'
    });
    $scope.cabin = "Economy";
    FlightsSrv.cabin = 'economy';
    $scope.trip = "One-way";
    FlightsSrv.trip = 'One-way';
    $scope.switchCabin = function(){
        if($scope.cabin==="Economy")
        {
            $scope.cabin="Business";
            FlightsSrv.cabin="business";
        }
        else
        {
            $scope.cabin="Economy";
            FlightsSrv.cabin="economy";
        }
    }
    $scope.switchTrip = function(){
        if($scope.trip==="One-way")
        {
            $scope.trip="Roundtrip";
            FlightsSrv.trip="Roundtrip";
        }
        else
        {
            $scope.trip="One-way";
            FlightsSrv.trip="One-way";
        }
    }
    $scope.otherAirlines=false;
    $scope.switch = function()
    {
        $scope.otherAirlines = !$scope.otherAirlines;
    };

    $scope.opendateModal1 = function() {
        $scope.datemodal1.show();
    };
    $scope.closedateModal1 = function(modal1) {
        $scope.datemodal1.hide();
        $scope.dt1 = modal1;
    };
    $ionicModal.fromTemplateUrl('templates/datemodal2.html', 
    function(modal) {
        $scope.datemodal2 = modal;
    },
    {
      scope: $scope, 
      animation: 'slide-in-up'
    });
    $scope.opendateModal2 = function() {
        $scope.datemodal2.show();
    };
    $scope.closedateModal2 = function(modal2) {
        $scope.datemodal2.hide();
        $scope.dt2 = modal2;
    };
    function AirportCodes() {
        FlightsSrv.getAirportCodes().success(function(airports) {
           $scope.Airports = airports;
       });
    };

    SetOriginAirport = function(originAirport) {
        FlightsSrv.setSelectedOriginAirport(originAirport);
    };

    SetDestinationAirport = function(destinationAirport) {
        FlightsSrv.setSelectedDestinationAirport(destinationAirport);
    };

    $scope.SearchFlights = function(origin, destination) {
        SetOriginAirport(origin);
        SetDestinationAirport(destination);
        var d1 = new Date($scope.dt1);
        var d2 = new Date($scope.dt2);
        d1 = d1.getTime();
        d2 = d2.getTime();
        FlightsSrv.setDepartDate(d1);
        FlightsSrv.setReturnDate(d2);
        if($scope.otherAirlines)
            FlightsSrv.airline='Other';
        else
            FlightsSrv.airline= 'United';
        $state.go('flights');
    };

    AirportCodes();

});

app.controller('flightsCtrl', function($scope, FlightsSrv,$state) {
    $scope.origin = FlightsSrv.selectedOriginAirport;
    $scope.destination = FlightsSrv.selectedDestinationAirport;
    $scope.date = dateFixer2(FlightsSrv.departDate);

    function getFlights(){
    FlightsSrv.getAllFlights().success(function(flights){
        $scope.flights=flights.outgoingFlights;
        FlightsSrv.returnFlights = flights.returnFlights;
    });
    }
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
    function dateFixer2(date) {
        var d = new Date(date);
        var y = d.getFullYear();
        var m = d.getMonth()+1;
        var day = d.getDate();
        return day + "/" + m+ "/"+ y;
    }
    $scope.next = function(){
        $state.go('flights2');
    }
    getFlights();
});

app.controller('flights2Ctrl', function($scope, FlightsSrv,$state) {
    $scope.destination = FlightsSrv.selectedOriginAirport;
    $scope.origin = FlightsSrv.selectedDestinationAirport;
    $scope.date = dateFixer2(FlightsSrv.returnDate);
    function getFlights(){
        $scope.flights=FlightsSrv.returnFlights;
    }
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
    function dateFixer2(date) {
        var d = new Date(date);
        var y = d.getFullYear();
        var m = d.getMonth()+1;
        var day = d.getDate();
        return day + "/" + m+ "/"+ y;
    }
    getFlights();
    $scope.next = function(){
        $state.go('index');
    }
});

app.factory('FlightsSrv', function ($http) {
    return {
        getAirportCodes : function() {
            return $http.get('http://54.187.103.196/api/data/codes');
        },
        getAllFlights : function() {
            return $http.get('http://54.187.103.196/api/flights/search/'+this.selectedOriginAirport+'/'+this.selectedDestinationAirport+'/'+this.departDate+'/'+this.returnDate+'/'+this.cabin+'?airline='+this.airline+'&wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60');
        },
        setSelectedOriginAirport: function(value) {
            this.selectedOriginAirport = value;
        },
        getSelectedOriginAirport: function() {
            return this.selectedOriginAirport;
        },
        setSelectedDestinationAirport: function(value) {
            this.selectedDestinationAirport = value;
        },
        getSelectedDestinationAirport: function() {
            return this.selectedDestinationAirport;
        },
        setDepartDate: function(value) {
            this.departDate = value;
        },
        setReturnDate: function(value) {
            this.returnDate = value;
        }
    };
});
