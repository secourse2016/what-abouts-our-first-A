/**
 * App routes:
 */
module.exports = function(app,mongo) {

    /* GET ALL STATES ENDPOINT */
    app.get('/api/data/codes', function(req, res) {
      var codes =  require('../airports.json');
      res.json( codes );
    });

    app.get('/api/data/flight', function(req, res) {
      var flights =  require('../flights.json');
      res.json( flights );
    });

    /* RENDER MAIN PAGE */
 
	app.get('/', function (req, res) {
	  res.sendFile(__dirname + '/public/index.html');
	});
};
