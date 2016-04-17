var flights = require('../flights.json');
var airports = require('../airports.json');
var db = require('./db.js');
var crypto = require('crypto');

exports.seedDB = function (cb) {
    seedFlights(function(err1,seededFlights) {
        seedAirports(function(err2,seededAirports) {
            if(err1 || err2){
                throw Error('Failed to seed a collection in the Database');
            }
            cb(null,seedAirports && seedFlights);
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
    
exports.getFlights = function ( flyingFrom , flyingTo , departDate,cb ) {
    console.log(departDate);
	db.db().collection('Flights').find({origin: flyingFrom,destination:flyingTo,date:departDate}).toArray(function (err, flights) {
        if (err) return "An error occurred";
        else
            cb(null,flights);
    });
}

function randomObjectId(length) {
    return crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, length).toUpperCase();
}

exports.reserve = function reserve( fn , ln , flightNumber , seatNumber , windowBoolean , economyBoolean , cb) {
    var bookingRefNum = randomObjectId(5);
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
    
