
app = angular.module('United_Airlines', ['ionic','pickadate','angular-stripe']);
 var airlines = {
        "Lufthansa": { 
            "IP": "ec2-54-152-123-100.compute-1.amazonaws.com" 
        },
        "KLM": { 
            "IP": "ec2-52-26-166-80.us-west-2.compute.amazonaws.com" 
        },
        "Emirates Airlines": { 
            "IP": "52.90.46.68" 
        },
        "Air France": { 
            "IP": "52.34.160.140"
        },
        "Swiss Air": { 
            "IP": "www.swiss-air.me"
        },
        "Delta Airlines": { 
            "IP": "52.25.15.124"
        },
        "Japan Airlines": { 
            "IP": "54.187.208.145"
        },
        "Singapore Airlines": { 
            "IP": "sebitsplease.com.s3-website-us-east-1.amazonaws.com"
        },
        "Dragonair": { 
            "IP": "52.58.46.74"
        },
        "Hawaiian": { 
            "IP": "54.93.36.94"
        },
        "Austrian": { 
            "IP": "ec2-52-90-41-197.compute-1.amazonaws.com"
        },
        "South African Airways": { 
            "IP": "54.213.157.185"
        },
        "Malaysia Airlines": { 
            "IP": "52.32.109.147"
        },
        "Northwest Airlines": { 
            "IP": "52.36.169.206"
        },
        "Cathay Pacific Airlines": { 
            "IP": "ec2-52-91-94-227.compute-1.amazonaws.com"
        },
        "Air Madagascar": { 
            "IP": "54.191.202.17"
        },
        "Alaska": { 
            "IP":"52.207.211.179"
        },
        "Turkish Airlines": { 
            "IP": "52.27.150.19"
        },
        "Virgin australia": { 
            "IP": "54.93.116.90"
        },
        "Iberia": { 
            "IP": "52.58.24.76"
        },
        "United": { 
            "IP":"54.187.103.196"
        },
        "AirNewZealand": { 
            "IP":"52.28.246.230"
        }
    }

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard)
    {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) 
    {
      StatusBar.styleDefault();
    }
  });
})
app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })
    .state('tab.search',{
        url: '/search',
        views: {
            'tab-search': {
                templateUrl: 'partials/main.html',
                controller: 'mainCtrl'
            }
        }
    })
    .state('tab.reservation',{
        url: '/reservation',
        views:{
            'tab-reservation': {
                templateUrl: 'partials/reservation.html',
                controller: 'reservationCtrl'
            }
        }  
    })
    .state('tab.search-flights',{
        url: '/flights',
        views:{
            'tab-search':{
                templateUrl:'partials/flights.html',
                controller:'flightsCtrl'
            }
        }
    })
    .state('tab.search-flights2',{
        url: '/flights2',
        views:{
            'tab-search':{
                templateUrl:'partials/flights2.html',
                controller:'flights2Ctrl'
            }
        }
    })        
    .state('tab.search-confirm',{
        url: '/confirm',
        views:{
            'tab-search':{
                templateUrl:'partials/confirm.html',
                controller:'confirmCtrl'
            }
        }
    })
    .state('tab.search-payment', {
        url: '/payment',
        views:{
            'tab-search':{
                templateUrl:'partials/payment.html',
                controller:'paymentCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise('/tab/search');

});
app.controller('indexCtrl',function($state,$scope){
    $scope.goHome = function(){
        $state.go('tab.search');
    }
})
app.controller('reservationCtrl', function($scope,FlightsSrv,$state,$ionicPopup) {
    $scope.hidden = true;
    $scope.hidden2 = true;
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
    $scope.search = function(brn) {
        if(brn === "")
        {
            $ionicPopup.alert({
                    title: 'Error',
                    template: 'Invalid Booking Reference Number'
            });
        }
        else
        {
            FlightsSrv.searchReservation(brn).success(function(flights){
                if(flights === null||flights ==="")
                {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'Invalid Booking Reference Number'
                    });
                }
                else
                {
                    $scope.x = flights;
                    $scope.d1 = $scope.dateFixer2(flights.outFlight.date);
                    $scope.d2 = $scope.dateFixer(flights.outFlight.date);
                    $scope.hidden = false;
                    console.log(flights);
                    if(flights.returnFlight!=null)
                    {
                        $scope.hidden2 = false;
                        $scope.d3 = $scope.dateFixer2(flights.returnFlight.date);
                        $scope.d4 = $scope.dateFixer(flights.returnFlight.date);
                    }
                }
            }) 
        }
    }
});

app.controller('mainCtrl', function($scope, $state, FlightsSrv,$ionicModal,$ionicPopup) {
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
    $scope.plus = function(pCount){
        $scope.persons=pCount<5?$scope.persons+1:$scope.persons
    }
    $scope.minus = function(pCount){
        $scope.persons=pCount>1?$scope.persons-1:$scope.persons
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
        if(origin===""||destination===""||$scope.dt1===undefined||($scope.dt2===undefined&&$scope.trip==="Roundtrip"))
        {
            $ionicPopup.alert({
                        title: 'Error',
                        template: 'One of the inputs is missing.'
                    });
        }
        else
        {
            SetOriginAirport(origin);
            SetDestinationAirport(destination);
            var d1 = new Date($scope.dt1);
            var d2 = new Date($scope.dt2);
            d1 = d1.getTime();
            d2 = d2.getTime();
            FlightsSrv.persons = parseInt($scope.persons);
            FlightsSrv.setDepartDate(d1);
            FlightsSrv.setReturnDate(d2);
            if($scope.otherAirlines)
                FlightsSrv.airline='Other';
            else
                FlightsSrv.airline= 'United';
            $state.go('tab.search-flights');
        }
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
                    $state.go('tab.search-confirm');
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
                    $state.go('tab.search-flights2');
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
        $state.go('tab.search-confirm');
    }
});
app.controller('confirmCtrl', function($scope, FlightsSrv,$state) {
    $scope.x=FlightsSrv.flight1;
    $scope.y=FlightsSrv.flight2;
    $scope.hidden=false;
    $scope.total = function(x,y){
        FlightsSrv.totalPrice= y===undefined?(x*FlightsSrv.persons):((parseInt(x)+parseInt(y))*FlightsSrv.persons);
        return FlightsSrv.totalPrice;
    }
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
    $scope.next = function(){
        $state.go('tab.search-payment');
    }
});
app.controller('paymentCtrl', function($scope, FlightsSrv,$state,$ionicPopup) {
    $scope.home = function(fn,ln,number,dob,country,expy,expm,cvc) 
    {
        if(FlightsSrv.flight2===undefined||FlightsSrv.flight1.Airline===FlightsSrv.flight2.Airline)
        {
            bookOne(fn,ln,number,dob,country,expy,expm,cvc);
        }
        else
        {
            bookTwo(fn,ln,number,dob,country,expy,expm,cvc);
        }
    }
    function bookOne(fn,ln,number,dob,country,expy,expm,cvc){
        angular.forEach(airlines , function(value, key) {
            if (key === FlightsSrv.flight1.Airline) 
            {
                FlightsSrv.getKey(value.IP).success(function(stripeKey){
                    Stripe.setPublishableKey(stripeKey);
                    function stripeResponseHandler(status, response) {
                        if (response.error) {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: response.error.message
                            })
                        } 
                        else{
                            var token = response.id;
                            var d = new Date(dob);
                            var id = FlightsSrv.flight2===undefined?null:FlightsSrv.flight2.flightId;
                            FlightsSrv.book(value.IP,token,fn,ln,number,d.getTime(),country,FlightsSrv.totalPrice,FlightsSrv.flight1.flightId,id).success(function(data){//TODO
                                if(data.refNum!=null){
                                    FlightsSrv.brn1 = data.refNum;
                                    FlightsSrv.airline1 = FlightsSrv.flight1.Airline;
                                    $ionicPopup.alert({
                                        title: 'Booking Successful',
                                        template: 'Your Booking Reference Number: '+data.refNum+' From: '+FlightsSrv.airline1
                                    })
                                    $state.go("tab.search");
                                }else{
                                    $ionicPopup.alert({
                                        title: 'Error',
                                        template: data.errorMessage.message
                                    })
                                }
                            });
                        }
                    }
                    Stripe.card.createToken({
                        number: number,
                        cvc: cvc,
                        exp_month: expm,
                        exp_year: expy
                    },stripeResponseHandler);
                })
            }
        });
    }
    function bookTwo(fn,ln,number,dob,country,expy,expm,cvc){
        angular.forEach(airlines , function(value, key) {
            if (key === FlightsSrv.flight1.Airline) {
                FlightsSrv.getKey(value.IP).success(function(stripeKey){
                    Stripe.setPublishableKey(stripeKey+"");
                    function stripeResponseHandler(status, response) {
                        if (response.error) {
                            $ionicPopup.alert({
                                title: 'Error',
                                template: response.error.message
                            })
                        } 
                        else{
                            var token = response.id;
                            var d = new Date(dob);
                            FlightsSrv.book(value.IP,token,fn,ln,number,d.getTime(),$scope.country,FlightsSrv.flight1.cost,FlightsSrv.flight1.flightId,null).success(function(data){//TODO
                                if(data.refNum!=null)
                                {
                                    FlightsSrv.brn1 = data.refNum;
                                    angular.forEach(airlines , function(value2, key2) {
                                        if (key2 === FlightsSrv.flight2.Airline)
                                        {
                                            FlightsSrv.getKey(value2.IP).success(function(stripeKey){
                                                Stripe.setPublishableKey(stripeKey+"");
                                                function stripeResponseHandler2(status2, response2) {
                                                    if (response2.error) {
                                                        $ionicPopup.alert({
                                                            title: 'Error',
                                                            template: response2.error.message
                                                        })
                                                    } 
                                                    else{
                                                        var token = response2.id;
                                                        var d2 = new Date(dob);
                                                        FlightsSrv.book(value2.IP,token,fn,ln,number,d2.getTime(),country,FlightsSrv.flight2.cost,FlightsSrv.flight2.flightId,null).success(function(data2){//TODO
                                                            if(data2.refNum!=null){
                                                                FlightsSrv.brn2 = data2.refNum;
                                                                FlightsSrv.airline1 = FlightsSrv.flight1.Airline;
                                                                FlightsSrv.airline2 = FlightsSrv.flight2.Airline;
                                                                $ionicPopup.alert({
                                                                    title: 'Booking Successful',
                                                                    template: 'Your First Booking Reference Number: '+FlightsSrv.brn1+' From: '+FlightsSrv.airline1
                                                                })
                                                                $ionicPopup.alert({
                                                                    title: 'Booking Successful',
                                                                    template: 'Your Second Booking Reference Number: '+FlightsSrv.brn2+' From: '+FlightsSrv.airline2
                                                                })
                                                                $state.go("tab.search");
                                                            }else{
                                                                $ionicPopup.alert({
                                                                    title: 'Error',
                                                                    template: data2.error.message
                                                                })
                                                            }
                                                        });
                                                    }
                                                }
                                                Stripe.card.createToken({
                                                    number: number,
                                                    cvc: cvc,
                                                    exp_month: expm,
                                                    exp_year: expy
                                                },stripeResponseHandler2);
                                            })
                                        }

                                    });
                                }else
                                {
                                    $ionicPopup.alert({
                                        title: 'Error',
                                        template: data.errorMessage.message
                                    })
                                    alert(data.errorMessage.message);
                                }
                            });
                        }
                    }
                    Stripe.card.createToken({
                        number: number,
                        cvc: cvc,
                        exp_month: expm,
                        exp_year: expy
                    },stripeResponseHandler);
                })
            }
            
        });
    }
    // $scope.home = function(fn,ln) {
    //     FlightsSrv.reserve(fn,ln).success(function (response) {
    //         FlightsSrv.setBrn(response);
    //         var alertPopup = $ionicPopup.alert({
    //             title: 'Flight Booked',
    //             template: 'Your Booking Reference Number is '+response
    //         });

    //         alertPopup.then(function(res) {
    //             $state.go('tab.search'); 
    //         });
    //     });
    // }
 });
app.factory('FlightsSrv', function ($http) {
    return {
        getAirportCodes : function() {
            return $http.get('http://54.187.103.196/api/data/codes');
        },
        getAllFlights : function() {
            return $http.get('http://54.187.103.196/api/flights/search/'+this.selectedOriginAirport+'/'+this.selectedDestinationAirport+'/'+this.departDate+'/'+this.returnDate+'/'+this.cabin+'/'+this.persons+'?airline='+this.airline+'&wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60');
        },
        getOneWayFlights : function() {
            return $http.get('http://54.187.103.196/api/flights/search/'+this.selectedOriginAirport+'/'+this.selectedDestinationAirport+'/'+this.departDate+'/'+this.cabin+'/'+this.persons+'?airline='+this.airline+'&wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60');
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
        book : function(airlineUrl,token,fn,ln,passNo,dob,country,cost,departFlightId,returnFlightId) {
            return $http.post('http://'+airlineUrl+'/booking?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60',{
                "passengerDetails":[{
                    "firstName": fn, // (required)
                    "lastName": ln,  // (required)
                    "passportNum": passNo, // (required)
                    "dateOfBirth": dob,  // (required)
                    "nationality": country // (optional)
                }],
                "class": this.cabin,  // (required)
                "cost": cost, // (required)
                "outgoingFlightId": departFlightId, // mongodb _id => 5NuiSNQdNcZwau92M (required)
                "returnFlightId": returnFlightId, // mongodb _id => 9DuiBNVjNcUwiu42J (required)
                "paymentToken": token // stripe generated token (required)
            });
        },
        getKey : function(airlineUrl) {
            return $http.get('http://'+airlineUrl+'/stripe/pubkey?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60');
        },
        reserve : function(fn,ln) {
            return $http.get('http://54.187.103.196/api/reserve/'+fn+'/'+ln+'/'+this.flight1.origin+'/'+this.flight1.destination+'/'+this.flight1.flightNumber+'/'+this.cabin+'/'+this.departDate+'?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60');
        },
        searchReservation : function(brn) {
            return $http.get('http://54.187.103.196/api/reservations/'+brn+'?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60'); 
        },
        setBrn:function(value) {
            this.brn=value;
        },
        setReturnDate: function(value) {
            this.returnDate = value;
        }
    };
});
