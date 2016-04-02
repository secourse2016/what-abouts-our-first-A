App = angular.module('United_Airlines', ['ui.bootstrap', 'ngRoute']);

App.config(function($routeProvider,$locationProvider) {
    $routeProvider

        // route for the home page
        .when('/asdf', {
            templateUrl : '/partials/main.html',
            controller  : 'mainCtrl'
        })

        // route for the flights page
        .when('/flights', {
            templateUrl : '/partials/flights.html',
            controller  : 'flightsCtrl'
        })

        .when('/flights2',{
            templateUrl : '/partials/flights2.html',
            controller  : 'flights2Ctrl'
        })

        .when('/',{
            templateUrl : '/partials/confirm.html',
            controller  : 'confirmCtrl'
        })

        .when('/payment',{
            templateUrl : '/partials/payment.html',
            controller  : 'paymentCtrl'
        });
        
    $locationProvider.html5Mode({enabled: true,requireBase: false});    
});
