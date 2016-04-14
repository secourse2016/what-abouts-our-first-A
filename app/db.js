(function(){
    var client = require('mongodb').MongoClient;
    var db;

    module.exports =  {
        init: function(dbURL, callback) {
            client.connect(dbURL, function(err, database) {
              if (err) console.log("[error] mongo connection: ", err);
              db = database;
              if(callback) callback();
            });
        },
        db: function() {
            return db;
        },
        close: function() {
            db.close();
        }
    };

})();