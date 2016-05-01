//our token:
//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60
App.factory('FlightsSrv', function ($http) {
    return {
        getAirportCodes : function() {
            return $http.get('/api/data/codes');
        },
        book : function(token,fn,ln,passNo,dob,country,cost,returnFlightId) {
            return $http.post('/booking?wt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60',{
                "passengerDetails":[{
                    "firstName": fn, // (required)
                    "lastName": ln,  // (required)
                    "passportNum": passNo, // (required)
                    "dateOfBirth": dob,  // (required)
                    "nationality": country // (optional)
                }],
                "class": this.cabin,  // (required)
                "cost": cost, // (required)
                "outgoingFlightId": this.departFlight.flightId, // mongodb _id => 5NuiSNQdNcZwau92M (required)
                "returnFlightId": returnFlightId, // mongodb _id => 9DuiBNVjNcUwiu42J (required)
                "paymentToken": token // stripe generated token (required)
            });
        },
        reserve : function(fn,ln) {
            return $http.get('/api/reserve/'+fn+'/'+ln+'/'+this.departFlight.origin+'/'+this.departFlight.destination+'/'+this.departFlight.flightNumber+'/'+this.cabin+'/'+this.departDate,{
                "headers" : { 'x-access-token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60'}
            });
        },
        getFlights : function() {
            return $http.get('/api/flights/search/'+this.selectedOriginAirport+'/'+this.selectedDestinationAirport+'/'+this.departDate+'/'+this.returnDate+'/'+this.cabin+'/'+this.getMultiplier()+'?airline='+this.airline, {
                "headers" : { 'x-access-token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60'}
            });        
        },
        getMyReservation : function() {
            return $http.get('/api/reservations/'+this.selectedBookingRefNumber, {
                "headers" : { 'x-access-token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60'}
            });        
        },

        getFlightsOne : function() {
            return $http.get('/api/flights/search/'+this.selectedOriginAirport+'/'+this.selectedDestinationAirport+'/'+this.departDate+'/'+this.cabin+'/'+this.getMultiplier()+'?airline='+this.airline, {
                "headers" : { 'x-access-token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60'}
            });        
        },
        fixDate : function(date) {
            return $http.get('/api/dateconverter/'+date);
        },
        setAirline: function(value) {
            this.airline=value;
        },
        getSelectedBookingRefNumber: function() {
            return this.selectedBookingRefNumber;
        },
        setSelectedBookingRefNumber: function(value) {
            this.selectedBookingRefNumber = value;
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
        setHidden: function(hidden) {
            this.hidden = hidden;
        },
        getHidden: function() {
            return this.hidden;
        },
        getCabin:function() {
            return this.cabin;
        },
        setBrn:function(value) {
            this.brn=value;
        },
        getBrn:function() {
            return this.brn;
        }
    };
});
