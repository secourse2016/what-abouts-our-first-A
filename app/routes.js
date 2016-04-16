/**
 * App routes:
 */
module.exports = function(app,mongo) {
      var path    = require('path');
      var jwt     = require('jsonwebtoken');
	

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
    });      

    /* DELETE DB */
    app.get('/db/delete', function(req, res) {
    });      

    /* Middleware Ehab and Osama work here*/
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

    /* ROUND-TRIP SEARCH REST ENDPOINT */
    app.get('/api/flights/search/:origin/:destination/:departingDate/returningDate/:class', function(req, res) {
        // retrieve origin, destination, departingDate, returningDate, and class from req.params.{{origin | departingDate | ...}}
        // return an array of objects with this exact format
        return 
        [{
            "flightNumber"      : "SE2804",
            "aircraftType"      : "Boeing",
            "aircraftModel"     : "747",
            "departureDateTime" : "Tuesday, April 12, 2016 06:25 PM",
            "arrivalDateTime"   : "Wednesday, April 13, 2016 12:25 AM",
            "origin"            : "JFK",
            "destination"       : "CAI",
            "cost"              : "750",
            "currency"          : "USD",
            "class"             : "economy",
            "Airline"           : "United"
        },{
            "flightNumber"      : "SE2805",
            "aircraftType"      : "Boeing",
            "aircraftModel"     : "747",
            "departureDateTime" : "Friday, April 23, 2016 04:25 AM",
            "arrivalDateTime"   : "Friday, April 23, 2016 03:25 PM",
            "origin"            : "CAI",
            "destination"       : "JFK",
            "cost"              : "845",
            "currency"          : "USD",
            "class"             : "economy",
            "Airline"           : "United"
        }];
    });    

    /* ROUND-TRIP SEARCH REST ENDPOINT */
    app.post('/api/flights/search/roundtrip', function(req, res) {
        // retrieve origin, destination, departingDate, returningDate, and class from req.payload
        // return an array of objects matching format above
        return [{}];
    });     

    /* ONE-WAY SEARCH REST ENDPOINT */
    app.get('/api/flights/search/:origin/:departingDate/:class', function(req, res) {
        // retrieve origin, destination, departingDate, and class from req.params.{{origin | departingDate}}
        // return an array of objects with this exact format
        return 
        [{
            "flightNumber"      : "SE2804",
            "aircraftType"      : "Airbus",
            "aircraftModel"     : "A320",
            "departureDateTime" : "Tuesday, April 12, 2016 06:25 PM",
            "arrivalDateTime"   : "Wednesday, April 13, 2016 12:25 AM",
            "origin"            : "JFK",
            "destination"       : "CAI",
            "cost"              : "1567",
            "currency"          : "USD",
            "class"             : "economy",
            "Airline"           : "United"
        }];    
    });        

    /* ONE-WAY SEARCH REST ENDPOINT */
    app.post('/api/flights/search/oneway', function(req, res) {
        // retrieve origin, destination, departingDate, and class from req.payload
        // return an array of objects matching format above
        return [{}];
    });         

};
