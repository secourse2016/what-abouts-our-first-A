module.exports = function(app,mongo) {
    var path       = require('path');
    var jwt        = require('jsonwebtoken');
    var allFlights = require('./allFlights.js');
    var moment     = require('moment');
    moment().format();
	
    function determinePrice(eco,buis,cabin) {
        console.log(cabin);
        if(cabin === "business"){
            return buis;
        }else{
            return eco;
        }
    }

    app.get('/403', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/partials', '403.html'));
    });
    app.get('/api/reserve/:fn/:ln/:flightNumber', function(req, res) {
      allFlights.reserve(req.params.fn , req.params.ln , req.params.flightNumber , 1 , 1 , 1 , function (err,seeded){
        if(err){
            res.send("err");
        }
        else{
            res.send("done");
        }
      } 
      );

    });

    app.get('/', function (req, res) {
	   res.sendFile(__dirname + '/public/index.html');
    });

    // app.get('/api/dateconverter/:date',function(req, res){
    //     var modifiedDate = moment(req.params.date).toDate().getTime();
    //     res.send(moment(modifiedDate).format('YYYY-MM-DD'));
    // });

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
    /**
     * ROUND-TRIP SEARCH REST ENDPOINT
     * @param origin - Flight Origin Location - Airport Code
     * @param destination - Flight Destination Location - Airport Code
     * @param departingDate - JavaScript Date.GetTime() numerical value corresponding to format `YYYY-MM-DD`
     * @param returningDate - JavaScript Date.GetTime() numerical value corresponding to format `YYYY-MM-DD`
     * @param class - economy or business only
     * @returns {Array}
     */        
    app.get('/api/flights/search/:origin/:destination/:departingDate/:returningDate/:class', function(req, res) {
        // retrieve params from req.params.{{origin | departingDate | ...}}
        // return this exact format
        allFlights.getFlights(req.params.origin,req.params.destination,req.params.departingDate,function(err,flights){
            var outFlights = [];
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
                var returnFlights = [];
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
    });    

    /**
     * ONE-WAY SEARCH REST ENDPOINT 
     * @param origin - Flight Origin Location - Airport Code
     * @param DepartingDate - JavaScript Date.GetTime() numerical value corresponding to format `YYYY-MM-DD`
     * @param class - economy or business only
     * @returns {Array}
     */    
    app.get('/api/flights/search/:origin/:destination/:departingDate/:class', function(req, res) {
        // retrieve params from req.params.{{origin | departingDate | ...}}
        // return this exact format
        return 
        {
          outgoingFlights: 
            [{
                "flightNumber"      : "SE2804",
                "aircraftType"      : "Airbus",
                "aircraftModel"     : "A320",
                "departureDateTime" : 1460478300000,
                "arrivalDateTime"   : 1460478300000,
                "origin"            : "JFK",
                "destination"       : "CAI",
                "cost"              : "1567",
                "currency"          : "USD",
                "class"             : "economy",
                "Airline"           : "United"
            }]
        };
    });        
             
};
