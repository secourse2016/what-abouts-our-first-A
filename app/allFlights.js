var flights = require('../flights.json');
var airports = require('../airports.json');
var reservations = require('../reservations.json');
var db = require('./db.js');
var crypto = require('crypto');

function seedDB (cb) {
    seedFlights(function(err1,seededFlights) {
        seedAirports(function(err2,seededAirports) {
            seedReservations(function(err3,seededReservations) {
                if(err1 || err2 || err3) throw Error('Failed to seed a collection in the Database');
                return seededReservations && seededFlights && seedAirports;
            });
        });
    });
}

function seedFlights(cb) {
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

function seedAirports(cb) {
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
    
function seedReservations(cb) {
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
    
function getFlights( flyingFrom , flyingTo , departDate , returnDate , cabin   ) {
	db.db().collection('Flights').find({ origin:flyingFrom , destination:flyingTo , date:departDate }).toArray(function (err, flights) {
        if (err) return "An error occurred";
        return flights;
    });
}

function randomObjectId(length) {
    return crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, length).toUpperCase();
}

function reserve( fn , ln , flightNumber , seatNumber , windowBoolean , economyBoolean , cb) {
    var bookingRefNum = randomObjectId(6);
    var receiptNum = randomObjectId(7);
    
    db.db().collection('Reservations').findOne({ bookingRefNumber: bookingRefNum}, function(err1, doc1) {
        db.db().collection('Reservations').findOne({ receipt_number: receiptNum}, function(err2, doc2) {
            if( doc1 === null && doc2 === null) {
                db.db().collection('Reservations').insert({firstName : fn  , lastName : ln ,  bookingRefNumber : bookingRefNum , receipt_number : receiptNum});
                db.db().collection('Reservations').findOne({bookingRefNumber : bookingRefNum},function(err,record){
                    var reservationID = record._id;
                    db.db().collection('Flights').updateOne( {flighNumber: flightNumber} , {$push: { seatmap:{reservationID:reservationID,seatNo:seatNumber,window:windowBoolean,economy:economyBoolean}}});
                    cb(err,true);
                });
            } 
            else {
               reserve( fn , ln , flightNumber , seatNumber , windowBoolean , economyBoolean ) ;
            }
        });
    });
}

function viewMyReservedFlight( bookingRefNum , cb ){
    db.db().collection('Reservations').findOne({bookingRefNumber : bookingRefNum},function(err,record){
        if( record === null )
            cb(err,null); //Not a valid booking reference number
        else{
            var reservationID = record._id;
            db.db().collection('Flights').findOne( { seatmap: {reservationID:reservationID} } , function(err2 , flight){
                cb(err2,flight);
            });
        }
    });
}