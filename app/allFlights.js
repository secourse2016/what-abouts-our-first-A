var flights = require('../flights.json');
var airports = require('../airports.json');
var reservations = require('../reservations.json');
var db = require('./db.js');

function seedDB (cb) 
{
    seedFlights(function(err1,seededFlights) {
        seedAirports(function(err2,seededAirports) {
            seedReservations(function(err3,seededReservations) {
                if(err1 || err2 || err3) throw Error('Failed to seed a collection in the Database');
                return seededReservations || seededFlights || seedAirports;
            });
        });
    });
}

function seedFlights(cb)
{
    db.db().collection('Flights').find().toArray(function (err, docs) {
        if (err) return cb(err);
        if (docs.length > 0)
            cb(null, false);
        else {
            db.db().collection('Flights').insertMany(flights, function (err) {
                if (err) return cb(err);
                cb(null, true);
            });
        }
    });
}

function seedAirports(cb)
{
    db.db().collection('Airports').find().toArray(function (err, docs) {
        if (err) return cb(err);
        if (docs.length > 0)
            cb(null, false);
        else {
            db.db().collection('Airports').insertMany(airports, function (err) {
                if (err) return cb(err);
                cb(null, true);
            });
        }
    });
}
    
function seedReservations(cb)
{
    db.db().collection('Reservations').find().toArray(function (err, docs) {
        if (err) return cb(err);
        if (docs.length > 0)
            cb(null, false);
        else {
            db.db().collection('Reservations').insertMany(reservations, function (err) {
                if (err) return cb(err);
                cb(null, true);
            });
        }
    });
}
    
function getFlights( flyingFrom , flyingTo , departDate , returnDate , cabin   ) //persons
{
	db.db().collection('Flights').find({ origin:flyingFrom , destination:flyingTo , date:departDate }).toArray(function (err, flights) {
        if (err) return "An error occurred";
        return flights;
    });
}

	