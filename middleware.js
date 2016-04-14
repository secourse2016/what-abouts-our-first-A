var express = require('express');
var app = express();
//normal routes
app.get('/user/listUsers' , function(req.res) {
	//do something 
});

//middleware function 
app.use(function (req, res, next)
{
//continue only if jwt is verified , otherwise return 403
// next();

});

// secure api route 
app.get('user/listSecureUsers' , function(req , res){

// do something

});

app.listen(3000,function() {
	console.log('example app listening at http ://localhost:3000');
});
