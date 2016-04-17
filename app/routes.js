module.exports = function(app,mongo) {
      var path       = require('path');
      var jwt        = require('jsonwebtoken');
      var allFlights = require('./allFlights.js')
	

    app.get('/403', function (req, res) {
      res.sendFile(path.join(__dirname, '../public/partials', '403.html'));
    });

	app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/public/index.html');
	});

    app.get('/api/data/codes', function(req, res) {
      var codes =  require('../airports.json');
      res.json( codes );
    });

    app.get('/api/data/flight', function(req, res) {
      var flights =  require('../flights.json');
      res.json( flights );
    });
 
     app.get('/db/seed', function(req, res) {
        // allFlights.seed( function( err , seeded ){
        //     if(err)
        //         console.log("Error seeding");
        //     if(seeded)
        //         console.log("Seeding successfullly");
        // });
    });      

    /* DELETE DB */
    app.get('/db/delete', function(req, res) {
    });      

    /* Middleware */
    app.use(function(req, res, next) {


    	 // check header or url parameters or post parameters for token
        var token = req.body.wt || req.query.wt || req.headers['x-access-token'];   

        console.log("{{{{ TOKEN }}}} => ", token); 


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
            console.error('[ERROR]: JWT Error reason:', err);
            res.status(403).sendFile(path.join(__dirname, '../public/partials', '403.html'));
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
        return 
        {
          outgoingFlights: 
            [{
                "flightNumber"      : "SE2804",
                "aircraftType"      : "Boeing",
                "aircraftModel"     : "747",
                "departureDateTime" : 1460478300000,
                "arrivalDateTime"   : 1460478300000,
                "origin"            : "JFK",
                "destination"       : "CAI",
                "cost"              : "750",
                "currency"          : "USD",
                "class"             : "economy",
                "Airline"           : "United"
            }

            // ,
            // {
            //     other flights
            // }
            ]
           
          returnFlights:
            [{
                "flightNumber"      : "SE2805",
                "aircraftType"      : "Boeing",
                "aircraftModel"     : "747",
                "departureDateTime" : 1460478300000,
                "arrivalDateTime"   : 1460478300000,
                "origin"            : "CAI",
                "destination"       : "JFK",
                "cost"              : "845",
                "currency"          : "USD",
                "class"             : "economy",
                "Airline"           : "United"
            }]
        };
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
