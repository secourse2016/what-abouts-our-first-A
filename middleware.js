var express = require('express');
var app = express();
//normal routes
app.get('/user/listUsers' , function(req.res) {
	//do something 
});

//middleware function 
app.use(function (req, res, next)
{
//continue onlu if jwt is verified , otherwise return 403
// next();

});

// secure api route 
app.get('user/listSecureUsers' , function(req , res){

// do something

});

app.listen(3000,function() {
	console.log('exaple app listening at http ://localhost:3000');
});