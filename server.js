var app     = require('./app/app');

app.listen('3000', function(){
	require('./app/db').init(process.env.MONGODB_URL);
  	console.log('[OK] => HTTP Server listening on http://localhost:3000');
});

var stripe = require("stripe")("sk_test_QCs2H8B60sw0QEPDdd5dIfKn");

// (Assuming you're using express - expressjs.com	)
// Get the credit card details submitted by the form
/*var stripeToken = app.req.body.stripeToken;

var charge = stripe.charges.create({
  amount: 1000, // amount in cents, again
  currency: "usd",
  source: stripeToken,
  description: "Example charge"
}, function(err, charge) {
  if (err && err.type === 'StripeCardError') {
    // The card has been declined
  }
});*/
