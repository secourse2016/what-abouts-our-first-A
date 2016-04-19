var expect = require("chai").expect;
var allFlights = require("./app/allFlights.js");
var fs = require("fs");
var db = require('./app/db.js');

require('dotenv').config();
var path       = require('path');
    var jwt        = require('jsonwebtoken');
    var moment     = require('moment');
    
/*
 before(function(done) {
    db.connect(function(err, db) {
        if (err) return done(err);
        else done();
    });
});
*/
describe("Search", function(){
   describe("#scan()", function(){
it("should retrieve the files from a directory", function(done) {
    allFlights.scan(".", 0, function(err, flist){
        expect(flist).to.include.members([
           // "./.git/HEAD",
           //  "./.git/config",
           //  "./.git/description",
           //  "./.git/index",
           //  "./.git/packed-refs",
           //  "./.gitignore",


            /*"./public/core.js",
            "./public/favicon.ico",
            "./public/index.html",
            "./reservations.json",
            "./middleware.js" ,
            */

            "./airports.json",
            "./app/allFlights.js",
            
            "./app/app.js",
            "./app/db.js" ,
            "./app/routes.js" ,
            "./flights.json" ,
            "./package.json" ,
           "./server.js",
            "./test.js"
        ]);
        done();
    });
});
});





});
/*   describe("DB-Test ",function(){
   
it("should retrieve flights",function(){
var array=allFlights.getFlights("FRA","CAI","2016-05-06T20:30:00");
expect(array).to.deep.equal({
"flighNumber":"CR7KB9GB11",
"aircraft": "",
"capacity":5000,
"date": "2016-05-06T20:30:00",
"duration":90,
"origin": "FRA",
"destination": "CAI",
"availableSeats":1000,
"costeconomy":855,  
"costfirst":1500,
"seatmap":[
{"window":true,
"economy":true,
"reservation_id":"ABCD1234",
"seatNo":"M19"
}
]
});
   	})
   })
*/

 before(function(done) {
  db.init(process.env.MONGODB_URL);
//allFlights.clearDB();
 done();
  });





describe("getFlightsFromJSON", function() {
    it("should return an array of 11 Flights", function() {
       expect(allFlights.getFlightsFromJSON().length).to.be.equal (11);
    });
    it("first Flight in the array's flightNumber should be CR7KB9GB11", function() {
        expect(allFlights.getFlightsFromJSON()[0].flightNumber).to.be.equal ('CR7KB9GB11');
    });
});




describe("getAirportsFromJSON", function() {
    it("should return an array of 20 Airports", function() {
       expect(allFlights.getAirportsFromJSON().length).to.be.equal (20);
    });
    it("first Airport in the array's iata should be CPT", function() {
        expect(allFlights.getAirportsFromJSON()[0].iata).to.be.equal ('DEL');
    });
});





describe("getAirportFromJSON", function() {
    /*it('should return a flight object with an author and text property', function() {
        var quote = Quote.getQuoteFromJSON();
        assert.isDefined(quote.text);
        assert.isDefined(quote.author);
    });*/
    /*it('should return a random flight if index not specified', function() {
        assert.include(Quote.getQuotesFromJSON(), Quote.getQuoteFromJSON());
    });*/
    it('should return the first Airport if we pass 1', function() {
        var airport = allFlights.getAirportFromJSON(1);
        expect(airport.iata ).to.be.equal('DEL'),
       expect(airport.iso).to.be.equal('IN');
         
    });
});





describe("getFlightFromJSON", function() {
    /*it('should return a flight object with an author and text property', function() {
        var quote = Quote.getQuoteFromJSON();
        assert.isDefined(quote.text);
        assert.isDefined(quote.author);
    });*/
    /*it('should return a random flight if index not specified', function() {
        assert.include(Quote.getQuotesFromJSON(), Quote.getQuoteFromJSON());
    });*/
    it('should return the first Flight if we pass 1', function() {
        var flight = allFlights.getFlightFromJSON(1);
        expect(flight.flightNumber).to.be.equal('CR7KB9GB11'),
       expect(flight.aircraft).to.be.equal('Boeing');
         
    });
});





describe('seed', function() {

/*    before(allFlights.clearDB());
*/
/*
    it('should populate the db if db is empty returning true', function(done) {
        allFlights.seedDB(function(err, seeded) {
            if (err) return done(err);
            expect(seeded).to.be.true;
            done();
        });
    });*/


    
    it('should have populated the Flight collection with 11 document', function(done) {
        db.db().collection('Flights').find({}).toArray(function(err, flights) {
            if (err) return done(err);
            expect(flights.length).to.be.equal(11);
            done();
        });
    });
    


    it('should have populated the airports collection with 20 document', function(done) {
        db.db().collection('Airports').find({}).toArray(function(err, flights) {
            if (err) return done(err);
            expect(flights.length).to.be.equal(20);
            done();
        });
    });

    it(' if db is not empty returning false in the callback', function(done) {
        allFlights.seedDB(function(err, seeded) {
            if (err) return done(err);
            expect(seeded).to.be.false;
            done();
        });
    });
    it(' if db is not empty Flights collection should remain 11', function(done) {
        db.db().collection('Flights').find({}).toArray(function(err, flights) {
            if (err) return done(err);
            expect(flights.length).to.be.equal(11);
            done();
        });
    });
    it(' if db is not empty Airports collection should remain 20', function(done) {
        db.db().collection('Airports').find({}).toArray(function(err, airports) {
            if (err) return done(err);
           expect(airports.length).to.be.equal(20);
             done();
        });
    });



	



});