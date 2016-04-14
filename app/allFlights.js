var flights = require('../flights.json');
var airports = require('../airports.json');
var reservations = require('../reservations.json');
var db = require('./db.js');
var crypto = require('crypto');

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

function randomObjectId(length)
{
    return crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, length).toUpperCase();
}

function reserve( fn , ln , flightNumber , seatNumber ) 
{
    var bookingRefNum = randomObjectId(6);
    var receiptNum = randomObjectId(7);
    
    db.db().collection('Reservations').findOne({ bookingRefNumber: bookingRefNum}, function(err, doc1) {
        db.db().collection('Reservations').findOne({ receipt_number: receiptNum}, function(err, doc2) {
            if( doc1 == null && doc2 == null) 
            {
                db.db().Reservations.insert({firstName : fn  , lastName : ln ,  bookingRefNumber : bookingRefNum , receipt_number : receiptNum});
                var reservationID = db.db().Reservations.findOne({bookingRefNumber : bookingRefNum}, {_id:1});
                db.db().Flights.update( {flighNumber: flightNumber , seatmap[4]=seatNumber} , {$set: { seatmap[3]=reservationID }} );
            } 
            else 
            {
               reserve( fn , ln ) ;
            }
        });

        });
}
    
