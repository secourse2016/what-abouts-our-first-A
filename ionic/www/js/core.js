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
    })
    .state('confirm', {
        url: '/confirm',
        templateUrl: '/partials/confirm.html',
        controller: 'confirmCtrl'
    })
    .state('payment', {
        url: '/payment',
        templateUrl: '/partials/payment.html',
        controller: 'paymentCtrl'
    })
    .state('reservation',{
        url: '/reservation',
        templateUrl: '/partials/reservation.html',
        controller: 'reservationCtrl'  
    });

    $urlRouterProvider.otherwise('/#');

});

app.controller('reservationCtrl', function($scope,$state) {
    
});

app.controller('indexCtrl', function($scope,$state) {
    $scope.goHome = function(){
        $state.go('index');
    }
    $scope.goReserve = function(){
        $state.go('reservation');
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
    $scope.hidden= false;
    $scope.persons = 1;
    $scope.cabin = "economy";
    FlightsSrv.cabin = 'economy';
    $scope.trip = "Roundtrip";
    FlightsSrv.trip = 'Roundtrip';
    $scope.switchCabin = function(c){
        $scope.cabin=c;
        FlightsSrv.cabin=c;
    }
    $scope.switchTrip = function(trip){
        $scope.trip=trip;
        FlightsSrv.trip=trip;
        $scope.hidden=false;
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
        if(FlightsSrv.trip==="One-way")
        {
            FlightsSrv.getOneWayFlights().success(function(flights){
                $scope.flights=flights.outgoingFlights;
                $scope.next = function(flight){
                    FlightsSrv.flight1 = flight;
                    $state.go('confirm');
                }
            });
        }
        else
        {
            FlightsSrv.getAllFlights().success(function(flights){
                $scope.flights=flights.outgoingFlights;
                FlightsSrv.returnFlights = flights.returnFlights;
                $scope.next = function(flight){
                    FlightsSrv.flight1 = flight;
                    $state.go('flights2');
                }
            });    
        }
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
    $scope.next = function(flight){
        FlightsSrv.flight2 = flight;
        $state.go('confirm');
    }
});
app.controller('confirmCtrl', function($scope, FlightsSrv,$state) {
    $scope.x=FlightsSrv.flight1;
    $scope.y=FlightsSrv.flight2;
    $scope.hidden=false;
    if($scope.y===undefined)
        $scope.hidden=true;
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
    $scope.dateFixer2 = function(date) {
        var d = new Date(date);
        var y = d.getFullYear();
        var m = d.getMonth()+1;
        var day = d.getDate();
        return day + "/" + m+ "/"+ y;
    }
    $scope.next = function(flight){
        FlightsSrv.flight2 = flight;
        $state.go('payment');
    }
});
app.controller('paymentCtrl', function($scope, FlightsSrv,$state,$ionicPopup) {
    $scope.home = function(fn,ln) {
        FlightsSrv.reserve(fn,ln).success(function (response) {
            FlightsSrv.setBrn(response);
            var alertPopup = $ionicPopup.alert({
                title: 'Flight Booked',
                template: 'Your Booking Reference Number is '+response
            });

            alertPopup.then(function(res) {
                $state.go('index'); 
            });
        });
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
        getOneWayFlights : function() {
            return $http.get('http://54.187.103.196/api/flights/search/'+this.selectedOriginAirport+'/'+this.selectedDestinationAirport+'/'+this.departDate+'/'+this.cabin+'?airline='+this.airline+'&wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60');
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
         getDepartFlight: function() {
            return this.departFlight;
        },
        setDepartFlight: function(flight) {
            this.departFlight = flight;
        },
        setDepartDate: function(value) {
            this.departDate = value;
        },
        getDepartFlight: function() {
            return this.departFlight;
        },
        setDepartFlight: function(flight) {
            this.departFlight = flight;
        },
        setDepartPrice: function(price) {
            this.departPrice = price;
        },
        getDepartPrice: function() {
            return this.departPrice;
        },
        setReturnPrice: function(price) {
            this.returnPrice = price;
        },
        getReturnPrice: function() {
            return this.returnPrice;
        },
        setHidden: function(hidden) {
            this.hidden = hidden;
        },
        getHidden: function() {
            return this.hidden;
        },
        setCabin:function(cabin) {
            this.cabin = cabin;
        },
        getCabin:function() {
            return this.cabin;
        },
        reserve : function(fn,ln) {
            return $http.get('http://54.187.103.196/api/reserve/'+fn+'/'+ln+'/'+this.flight1.origin+'/'+this.flight1.destination+'/'+this.flight1.flightNumber+'/'+this.cabin+'/'+this.departDate+'?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60');
        },
        setBrn:function(value) {
            this.brn=value;
        },
        setReturnDate: function(value) {
            this.returnDate = value;
        }
    };
});
