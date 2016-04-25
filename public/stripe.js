var stripe = require('stripe')('sk_test_QCs2H8B60sw0QEPDdd5dIfKn');

angular.module('myApp', ['angular-stripe']);

/* Angular-Stripe exposes stripeProvider */
/* Use the stripeProvider in your config to set the publishable key */
 .config(function (stripeProvider) {
    stripeProvider.setPublishableKey('pk_test_uvzPDBESJ2MJ0cTwAuZDUDfx');
  });

