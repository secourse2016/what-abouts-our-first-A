module.exports = function(app,mongo) {
    var path       = require('path');
    var jwt        = require('jsonwebtoken');
    var allFlights = require('./allFlights.js');
    var moment     = require('moment');
    var http       = require('http');
    moment().format();
	var jwtToken   = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjA4MzkxMDcsImV4cCI6MTQ5MjM3NTIxMSwiYXVkIjoiNTQuMTg3LjEwMy4xOTY6MzAwMCIsInN1YiI6IlVuaXRlZF9BaXJsaW5lcyJ9.en-MKTd8N_dfLL7hr6Yvu-s3WzkV6-9_xEc-zRNnv60";

    function determinePrice(eco,buis,cabin) {
        if(cabin === "business"){
            return buis;
        }else{
            return eco;
        }
    }

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

    app.get('/api/flights/search/:origin/:destination/:departingDate/:returningDate/:class/', function(req, res) {
        var outFlights = [];
        var returnFlights = [];
        allFlights.getFlights(req.params.origin,req.params.destination,req.params.departingDate,function(err,flights){
            for (var i = 0; i < flights.length; i++) {
                var departDT = moment(flights[i].date, 'YYYY-MM-DD hh:mm A').toDate().getTime();
                var arriveDT = departDT+flights[i].duration*60000;
                outFlights.push({
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
                res.send({
                outgoingFlights     : outFlights,
                returnFlights       : returnFlights
                });
            });
        });

        if(req.query.airline==="Other")
        {
            var req2 = http.get('http://54.187.103.196:3000/api/flights/search/CAI/JED/2016-05-01/2016-05-02/economy?wt='+jwtToken, function(res2) {
                console.log('STATUS: ' + res2.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res2.headers));
                var bodyChunks = [];
                res2.on('data', function(chunk) {
                    bodyChunks.push(chunk);
                    console.log(bodyChunks);
                }).on('end', function() {
                    var body = Buffer.concat(bodyChunks);
                    console.log('BODY: ' + body);
                })
            });
            req2.send();
        }
    });    
 
    app.get('/api/flights/search/:origin/:destination/:departingDate/:class', function(req, res) {
            allFlights.getFlights(req.params.origin,req.params.destination,req.params.departingDate,function(err,flights){
                var outFlights = [];
                for (var i = 0; i < flights.length; i++) {
                    var departDT = moment(flights[i].date, 'YYYY-MM-DD hh:mm A').toDate().getTime();
                    var arriveDT = departDT+flights[i].duration*60000;

                    outFlights.push({
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
                res.send({
                    outgoingFlights     : outFlights
                });
            });
        });
    app.get('/api/reservations/:bookingrefnum', function(req, res) {
        allFlights.viewMyReservedFlight( req.params.bookingrefnum , function(err,myFlights){
            if(myFlights === null){
                res.send(null);
                console.log("invalid bookingrefnum")
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

};


