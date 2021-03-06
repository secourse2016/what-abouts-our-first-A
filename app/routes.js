module.exports = function(app,mongo) {
    var path       = require('path');
    var jwt        = require('jsonwebtoken');
    var allFlights = require('./allFlights.js');
    var moment     = require('moment');
    var http       = require('http');
    var async = require('async');
    var request = require('request');
    var jwtToken   = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60";
    var stripe = require('stripe')("sk_test_QCs2H8B60sw0QEPDdd5dIfKn");
    var outFlights = [];
    var returnFlights = [];
    var origin = "";
    var dest = "";
    var t1;
    var t2;
    var cabin;
    moment().format();

    function determinePrice(eco,buis,cabin) {
        if(cabin === "business"){
            return buis;
        }else{
            return eco;
        }
    }
    
    app.all('*',function (req,res,next) {
        res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          next();
    });

    app.get('/403', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/partials', '403.html'));
    });

    app.get('/', function (req, res) {
	   res.sendFile(__dirname + '/public/index.html');
    });

    app.get('/api/dateconverter/:date',function(req, res){
        var modifiedDate = moment(req.params.date).toDate().getTime();
        res.send(moment(modifiedDate).format('YYYY-MM-DD'));
    });

    app.get('/api/data/codes', function(req, res) {
      allFlights.getAirports( function (err , airports){
        res.send(airports);
      });
    });
    

    
 
    app.get('/db/seed', function(req, res) {
        allFlights.seedDB( function( err , seeded ){
            if(err)
              console.log("Error seeding");
            if(seeded)
              console.log("Seeded successfullly");
        });
    });      

    /* DELETE DB */
    app.get('/db/delete', function(req, res) {
        allFlights.clearDB();
    });      

    /* Middleware */
    app.use(function(req, res, next) {
        var token = req.body.wt || req.query.wt || req.headers['x-access-token'];   

        var jwtSecret = process.env.JWTSECRET;

          // Get JWT contents:
        try 
        {
            var payload = jwt.verify(token, jwtSecret);
            req.payload = payload;
            next();
        } 
        catch (err) 
        {

        }
	

    }); 

    app.get('/stripe/pubkey', function (req, res) {
       res.send('pk_test_uvzPDBESJ2MJ0cTwAuZDUDfx');
    });

    app.get('/api/flights/search/:origin/:destination/:departingDate/:returningDate/:class/:seats', function(req, res) {
        outFlights = [];
        returnFlights = [];
        origin = req.params.origin;
        dest = req.params.destination;
        seats = req.params.seats;
        t1 = req.params.departingDate;
        t2 = req.params.returningDate;
        cabin = req.params.class;
        function httpGet(url, callback) {
            const options = {
                url :  url+"/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"/"+seats+"?wt="+jwtToken,
                json : true
            };
            request(options,function(err, res, body) {
                if(body.outgoingFlights!=undefined)
                {
                    outFlights = outFlights.concat(body.outgoingFlights);
                }
                if(body.returnFlights!=undefined)
                {
                    returnFlights = returnFlights.concat(body.returnFlights);
                }
                callback(err, body);
            });
        }
        var urls= [
            "http://ec2-52-90-41-197.compute-1.amazonaws.com", //Austrian
            "http://ec2-52-26-166-80.us-west-2.compute.amazonaws.com",//KLM
            "http://www.swiss-air.me", //Swissair
            "http://52.207.211.179", //Alaskan
            "http://54.191.202.17", //AirMadagascar
            "http://52.34.160.140", //AirFrance
            "http://52.58.46.74" //Dragonair
            // "http://52.38.78.176/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"?wt="+jwtToken,//Oceanic
            // "http://sebitsplease.com.s3-website-us-east-1.amazonaws.com/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"?wt="+jwtToken//singapore
            // "http://52.25.15.124/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"?wt="+jwtToken //Delta
            // "http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"?wt="+jwtToken,//AirBerlin
            // "http://ec2-54-152-123-100.compute-1.amazonaws.com/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"?wt="+jwtToken, //luftahnsa
            // "http://52.90.46.68/#/home/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"?wt="+jwtToken,//Emirates
            // "http://52.27.150.19/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+t2+"/"+cabin+"?wt="+jwtToken //Turkish airlines
        ];
        allFlights.getFlights(req.params.origin,req.params.destination,req.params.departingDate,function(err,flights){
            for (var i = 0; i < flights.length; i++) {
                var departDT = moment(flights[i].date, 'YYYY-MM-DD hh:mm A').toDate().getTime();
                var arriveDT = departDT+flights[i].duration*60000;
                outFlights.push({
                "flightId"          : flights[i]._id,
                "flightNumber"      : flights[i].flightNumber,
                "aircraftType"      : flights[i].aircraft,
                "aircraftModel"     : "747",
                "departureDateTime" : departDT,
                "arrivalDateTime"   : arriveDT,
                "origin"            : flights[i].origin,
                "destination"       : flights[i].destination,
                "cost"              : determinePrice(flights[i].costeconomy,flights[i].costfirst,req.params.class),
                "currency"          : "USD",
                "class"             : req.params.class,
                "Airline"           : "United"
            })
            }
            allFlights.getFlights(req.params.destination,req.params.origin,req.params.returningDate,function(err,flights){
                for (var i = 0; i < flights.length; i++) {
                    var departDT = moment(flights[i].date, 'YYYY-MM-DD hh:mm A').toDate().getTime();
                    var arriveDT = departDT+flights[i].duration*60000;

                    returnFlights.push({
                    "flightId"          : flights[i]._id,
                    "flightNumber"      : flights[i].flightNumber,
                    "aircraftType"      : flights[i].aircraft,
                    "aircraftModel"     : "767",
                    "departureDateTime" : departDT,
                    "arrivalDateTime"   : arriveDT,
                    "origin"            : flights[i].origin,
                    "destination"       : flights[i].destination,
                    "cost"              : determinePrice(flights[i].costeconomy,flights[i].costfirst,req.params.class),
                    "currency"          : "USD",
                    "class"             : req.params.class,
                    "Airline"           : "United"
                    })
                }
                if(req.query.airline==="Other")
                {
                    async.map(urls, httpGet, function (err, res2){
                        if (err) return console.log(err);
                        else{
                            res.send({
                                outgoingFlights     : outFlights,
                                returnFlights       : returnFlights
                            });
                        }
                    });
                }
                else{
                    res.send({
                        outgoingFlights     : outFlights,
                        returnFlights       : returnFlights
                    });
                }
            });
        });
    });    
 
    app.get('/api/flights/search/:origin/:destination/:departingDate/:class/:seats', function(req, res) {
        outFlights = [];
        origin = req.params.origin;
        dest = req.params.destination;
        t1 = req.params.departingDate;
        cabin = req.params.class;
        var seats = req.params.seats;
        function httpGet(url, callback) {
            const options = {
                url :  url+"/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"/"+seats+"?wt="+jwtToken,
                json : true
            };
            request(options,function(err, res, body) {
                if(body.outgoingFlights!=undefined)
                {
                    outFlights = outFlights.concat(body.outgoingFlights);
                }
                callback(err, body);
            });
        }
        var urls= [
            "http://ec2-52-90-41-197.compute-1.amazonaws.com", //Austrian
            "http://ec2-52-26-166-80.us-west-2.compute.amazonaws.com", //KLM
            "http://www.swiss-air.me", //Swissair
            "http://52.207.211.179", //AlaskanAirlines
            "http://54.191.202.17", //AirMadagascar
            "http://52.34.160.140", //AirFrance
            "http://52.58.46.74"///api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken, //Dragonair
            // "http://52.38.78.176/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken,//Oceanic
            // "http://sebitsplease.com.s3-website-us-east-1.amazonaws.com/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken//singapore
            // "http://52.25.15.124/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken //Delta
            // "http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken,//AirBerlin
            // "http://ec2-54-152-123-100.compute-1.amazonaws.com/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken, //luftahnsa
            // "http://52.90.46.68/#/home/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken,//Emirates
            // "http://52.27.150.19/api/flights/search/"+origin+"/"+dest+"/"+t1+"/"+cabin+"?wt="+jwtToken //Turkish airlines
        ];
            allFlights.getFlights(req.params.origin,req.params.destination,req.params.departingDate,function(err,flights){
                for (var i = 0; i < flights.length; i++) {
                    var departDT = moment(flights[i].date, 'YYYY-MM-DD hh:mm A').toDate().getTime();
                    var arriveDT = departDT+flights[i].duration*60000;

                    outFlights.push({
                    "flightId"          : flights[i]._id,
                    "flightNumber"      : flights[i].flightNumber,
                    "aircraftType"      : flights[i].aircraft,
                    "aircraftModel"     : "767",
                    "departureDateTime" : departDT,
                    "arrivalDateTime"   : arriveDT,
                    "origin"            : flights[i].origin,
                    "destination"       : flights[i].destination,
                    "cost"              : determinePrice(flights[i].costeconomy,flights[i].costfirst,req.params.class),
                    "currency"          : "USD",
                    "class"             : req.params.class,
                    "Airline"           : "United"
                    })
                }
                if(req.query.airline==="Other")
                {                    
                    async.map(urls, httpGet, function (err, res2){

                        if (err) return console.log(err);
                        else{
                            res.send({
                                outgoingFlights     : outFlights,
                            });
                        }
                    });
                }
                else{
                    res.send({
                        outgoingFlights     : outFlights,
                    });
                }
            });
        });

    app.get('/api/reservations/:bookingrefnum', function(req, res) {
        allFlights.viewMyReservedFlight( req.params.bookingrefnum , function(err,myFlights){
            if(myFlights === null){
                res.send(null);
            }
            else{
                res.json(myFlights);
            }
        });
    }); 
    app.get('/api/reserve/:fn/:ln/:origin/:destination/:flightNumber/:cabin/:date', function(req, res) {
        allFlights.reserve(req.params.fn , req.params.ln,req.params.origin,req.params.destination,req.params.flightNumber,req.params.cabin,req.params.date, function (brn,receipt){
            res.send(brn);
        });
    });
    app.post('/booking',function(req,res){
        var stripeToken = req.body.paymentToken;
        var x= req.body.class;
        stripe.charges.create({
            amount:parseInt(req.body.cost)*100,
            currency: "usd",
            source: stripeToken,
            description: "test"
        },function(err,data){
            if(err)
            {
                res.send({refNum:null,errorMessage:err});
            }
            else
            {
                allFlights.newReserve(req.body.passengerDetails[0].firstName,req.body.passengerDetails[0].lastName,req.body.outgoingFlightId,req.body.returnFlightId,req.body.class,function(brn){
                    res.send({refNum:brn,errorMessage:null});
                })                    
            }
        })
    
    });
};


