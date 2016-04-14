var flights = require('../flights.json');
var airports = require('../airports.json');
var reservations = require('../reservations.json');
var db = require('.db.js');

function seedDB (cb) 
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

	