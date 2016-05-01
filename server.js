var app     = require('./app/app');

app.listen('3000', function(){
	require('./app/db').init(process.env.MONGODB_URL);
  	console.log('[OK] => HTTP Server listening on http://localhost:3000');
});
