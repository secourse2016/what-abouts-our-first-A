var flights = require('../flights.json');
var airports = require('../airports.json');
var reservations = require('../reservations.json');
var db = require('./db.js');
var fs = require("fs");

exports = module.exports = {};


exports.scan = function(dir, depth, done) {
   depth--;
   var results = [];
   fs.readdir(dir, function(err, list) {
       if (err) return done(err);
       var i = 0;
       (function next() {
           var file = list[i++];
           if (!file) return done(null, results);
           file = dir + '/' + file;
           fs.stat(file, function(err, stat) {
               if (stat && stat.isDirectory()) {
                   if (depth !== 0) {
                       var ndepth = (depth > 1) ? depth-1 : 1;
                       exports.scan(file, ndepth, function(err, res) {
                           results = results.concat(res);
                           next();
                       });
                   } else {
                       next();
                   }
               } else {
                   results.push(file);
                   next();
               }
           });
       })();
   });
};


exports.seedDB=function seedDB (cb) 
{
    seedFlights(function(err1,seededFlights) {
        seedAirports(function(err2,seededAirports) {
            seedReservations(function(err3,seededReservations) {
                if(err1 || err2 || err3) throw Error('Failed to seed a collection in the Database');
                return seededReservations || seededFlights || seededAirports;
            });
        });
    });
}

exports.seedFlights=function seedFlights(cb)
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

exports.seedAirports=function seedAirports(cb)
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
    
exports.seedReservations= function seedReservations(cb)
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
    
exports.getFlights=function getFlights( flyingFrom , flyingTo , departDate , returnDate , cabin   ) //persons
{
	db.db().collection('Flights').find({ origin:flyingFrom , destination:flyingTo , date:departDate }).toArray(function (err, flights) {
        if (err) return "An error occurred";
        return flights;
    });
}

	