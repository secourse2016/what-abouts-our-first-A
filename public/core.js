App = angular.module('United_Airlines', ['ui.bootstrap', 'ngRoute','ngAnimate']);

App.config(function($routeProvider,$locationProvider) {
    $routeProvider

        .when('/', {
            templateUrl : '/partials/main.html',
            controller  : 'mainCtrl'
        })
       
        .when('/flights', {
            templateUrl : '/partials/flights.html',
            controller  : 'flightsCtrl'
        })

        .when('/flights2',{
            templateUrl : '/partials/flights2.html',
            controller  : 'flights2Ctrl'
        })

        .when('/confirm',{
            templateUrl : '/partials/confirm.html',
            controller  : 'confirmCtrl'
        })
       .when('/403',{
            templateUrl : '/partials/403.html',
            controller  : '403Ctrl'
        })

        .when('/reservations',{
            templateUrl : '/partials/reservations.html',
            controller  : 'reservationsCtrl'
        })

        .when('/payment',{
            templateUrl : '/partials/payment.html',
            controller  : 'paymentCtrl'
        });
        
    $locationProvider.html5Mode({enabled: true,requireBase: false});    
});
