/**
 * Flights Service
 */
App.factory('FlightsSrv', function ($http) {
    return {
        getAirportCodes : function() {
            return $http.get('/api/data/codes');
        },
        getFlights : function() {
            return $http.get('/api/data/flights');
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
        setReturnPrice: function(price) {
            this.returnPrice = price;
        },
        setDepartPrice: function(price) {
            this.departPrice = price;
        },
        getDepartPrice: function() {
            return this.departPrice;
        },
        getReturnPrice: function() {
            return this.returnPrice;
        },
        getReturnFlight: function() {
            return this.returnFlight;
        },
        setReturnFlight: function(flight) {
            this.returnFlight = flight;
        },
        setMultiplier:function(mult) {
            this.multiplier = mult;
        },
        getMultiplier:function() {
            return this.multiplier;
        },
        setDepartDate:function(date) {
            this.departDate = date;
        },
        getDepartDate:function() {
            return this.departDate;
        },
        setReturnDate:function(date) {
            this.returnDate = date;
        },
        getReturnDate:function() {
            return this.returnDate;
        },
        setCabin:function(cabin) {
            this.cabin = cabin;
        },
        getCabin:function() {
            return this.cabin;
        }
    };
});
