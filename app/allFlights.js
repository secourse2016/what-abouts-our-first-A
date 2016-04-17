var flights = require('../flights.json');
var airports = require('../airports.json');
var db = require('./db.js');
var crypto = require('crypto');

exports.seedDB = function(cb) {
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
    var d = new Date(departDate);
    function checkDate(d2) 
    {
     var dateJSON = new Date(d2.date);
     console.log(dateJSON+' '+flyingFrom);
     return ((dateJSON.getMonth()+1 === d.getMonth()+1) && (dateJSON.getFullYear() === d.getFullYear()) && (dateJSON.getDate() === d.getDate()) ) ;
    }

	db.db().collection('Flights').find({origin: flyingFrom, destination:flyingTo}).toArray(function (err, flights) {
        if (err) return "An error occurred";
        else
        {
            var x = flights.filter(checkDate);
            cb(null,x);
        }
    });
}

function randomObjectId(length) {
    return crypto.createHash('md5').update(Math.random().toString()).digest('hex').substring(0, length).toUpperCase();
}

function generateBookingRefNumber(){
    return randomObjectId(5);
}

function generateReceiptNumber(){
    return randomObjectId(7);
}

var r = function ( fn , ln , flightNumber , seatNumber , windowBoolean , economyBoolean , bookingRefNum , receiptNum ,cb) {
    
    // db.db().collection('Reservations').findOne({ bookingRefNumber: bookingRefNum}, function(err1, doc1) {
    //     db.db().collection('Reservations').findOne({ receipt_number: receiptNum}, function(err2, doc2) {
    //         if( doc1 === null && doc2 === null) {
    //             db.db().collection('Reservations').insert({firstName : fn  , lastName : ln ,  bookingRefNumber : bookingRefNum , receipt_number : receiptNum});
    //             db.db().collection('Reservations').findOne({bookingRefNumber : bookingRefNum},function(err,record){
    //                 var reservationID = record._id;
    //                 db.db().collection('Flights').updateOne( {flighNumber: flightNumber} , {$push: { seatmap:{reservationID:reservationID,seatNo:seatNumber,window:windowBoolean,economy:economyBoolean}}});
    //                 cb(err,true);
    //             });
    //         } 
    //         else {
    //            r( fn , ln , flightNumber , seatNumber , windowBoolean , economyBoolean , bookingRefNum , receiptNum) ;
    //         }
    //     });
    // });
}

exports.reserve = r;

exports.clearDB = function() {
    db.db().listCollections().toArray().then(function (collections) {
        collections.forEach(function (c) {
            db.db().collection(c.name).removeMany();   
        });
      
       
    });
};
    
exports.getAirports = function( cb ){
    db.db().collection('Airports').find({}).toArray(function (err, airports){
        if (err) 
            cb(err,null);
        else
            cb(null,airports);
    });
}

function viewMyReservedFlight( bookingRefNum , cb ){
    db.db().collection('Reservations').findOne({bookingRefNumber : bookingRefNum},function(err,record){
        if( record === null )
            cb(err,null); //Not a valid booking reference number
        
        else{
            var reservationID = record._id;
            db.db().collection('Flights').find( { seatmap: {reservationID:reservationID} }).toArray(function(err2 , flights){
                cb(err2,flights);
            });
            
        }
        
    });
}