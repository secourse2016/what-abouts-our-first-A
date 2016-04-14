var expect = require("chai").expect;
var allFlights = require("./app/allFlights.js");
var fs = require("fs");
 
describe("Search", function(){
   describe("#scan()", function(){
it("should retrieve the files from a directory", function(done) {
    allFlights.scan(".", 0, function(err, flist){
        expect(flist).to.include.members([
           // "./.git/HEAD",
           //  "./.git/config",
           //  "./.git/description",
           //  "./.git/index",
           //  "./.git/packed-refs",
           //  "./.gitignore",
            "./airports.json",
            "./app/allFlights.js",
            
            "./app/app.js",
            "./app/db.js" ,
            "./app/routes.js" ,
            "./flights.json" ,
            "./middleware.js" ,
            "./package.json" ,
            "./public/core.js",
            "./public/favicon.ico",
            "./public/index.html",
            "./reservations.json",
            "./server.js",
            "./test.js"
        ]);
        done();
    });
});
});
});
   describe("DB-Test ",function(){
   
it("should retrieve flights",function(){

var array=allFlights.getFlights("FRA","CAI","2016-05-06T20:30:00");
expect(array).to.deep.equal({
"flighNumber":"CR7KB9GB11",
"aircraft": "",
"capacity":5000,
"date": "2016-05-06T20:30:00",
"duration":90,
"origin": "FRA",
"destination": "CAI",
"availableSeats":1000,
"costeconomy":855,
"costfirst":1500,
"seatmap":[
{"window":true,
"economy":true,
"reservation_id":"ABCD1234",
"seatNo":"M19"
}
]
});
   	})
/*
it("seeded collections in DB ",function(){

	var result=allFlights.seedDB(null);
	expect(result).to.equal((null,true));
})*/






   })