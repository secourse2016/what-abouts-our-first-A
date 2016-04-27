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
            });

        $urlRouterProvider.otherwise('/#');

});


/**
 * Main Controller
 */
app.controller('mainCtrl', function($scope, $state, FlightsSrv,$ionicModal) {

 $ionicModal.fromTemplateUrl('templates/datemodal.html', 
      function(modal) {
          $scope.datemodal1 = modal;
      },
      {
      // Use our scope for the scope of the modal to keep it simple
      scope: $scope, 
      // The animation we want to use for the modal entrance
      animation: 'slide-in-up'
      }
  );
  $scope.opendateModal1 = function() {
    $scope.datemodal1.show();
  };
  $scope.closedateModal1 = function(modal1) {
    $scope.datemodal1.hide();
    $scope.dt1 = modal1;
    $scope.dt2 = modal2;
  };
  $ionicModal.fromTemplateUrl('templates/datemodal2.html', 
      function(modal) {
          $scope.datemodal2 = modal;
      },
      {
      // Use our scope for the scope of the modal to keep it simple
      scope: $scope, 
      // The animation we want to use for the modal entrance
      animation: 'slide-in-up'
      }
  );
  $scope.opendateModal2 = function() {
    $scope.datemodal2.show();
  };
  $scope.closedateModal2 = function(modal2) {
    $scope.datemodal2.hide();
    $scope.dt2 = modal2;
  };
  function AirportCodes() {
    FlightsSrv.getAirportCodes().success(function(airports) {
        console.log('[airports codes=>', airports);
         $scope.Airports = airports;
     });
  };

  /* Record User's Selected Origin Airport  */
  SetOriginAirport = function(originAirport) {
    console.log("[originAirport]=>", originAirport);
    FlightsSrv.setSelectedOriginAirport(originAirport);
  };

  /* Record User's Selected Destination Airport  */
  SetDestinationAirport = function(destinationAirport) {
    console.log("[destAirport]=>", destinationAirport);
    FlightsSrv.setSelectedDestinationAirport(destinationAirport);
  };

  /* Find All Available Flights  */
  $scope.SearchFlights = function(origin, destination) {
    SetOriginAirport(origin);
    SetDestinationAirport(destination);
    $state.go('flights');
  };

  /* Get Airports on page render  */
  AirportCodes();

});



/**
 * Flights Controller
 */
app.controller('flightsCtrl', function($scope, FlightsSrv) {

  /* Retrieve Selected Airports Codes */
  $scope.flight = {
    origin      : FlightsSrv.getSelectedOriginAirport(),
    destination : FlightsSrv.getSelectedDestinationAirport()
  };

});


/** * Flights Service
 */
app.factory('FlightsSrv', function ($http) {
     return {
         getAirportCodes : function() {
            console.log('[flightsSrv]=>getAirportCodes');
           return $http.get('http://localhost:3000/api/data/codes');
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
         }
     };
 });
