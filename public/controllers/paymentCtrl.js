App.controller('paymentCtrl',function($scope,FlightsSrv,$location){
    $scope.home = function() {
/*
$(function() {
  var $form = $('#payment-form');
  $form.submit(function(event) {
    // Disable the submit button to prevent repeated clicks:
    $form.find('.submit').prop('disabled', true);

    // Request a token from Stripe:
    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from being submitted:
    return false;
  });
});
function stripeResponseHandler(status, response) {
  // Grab the form:
  var $form = $('#payment-form');

  if (response.error) { // Problem!

    // Show the errors on the form:
    $form.find('.payment-errors').text(response.error.message);
    $form.find('.submit').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token ID into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken">').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
};*/    function stripeResponseHandler(status, response) {
            if (response.error) {
                alert(response.error.message);
            } 
            else{
                var token = response.id;
                FlightsSrv.sendStripeToken(token).success(function(data){//TODO
                    if(data.errorMessage==null){
                        FlightsSrv.reserve($scope.fn,$scope.ln).success(function (response2) {
                            FlightsSrv.setBrn(response2);
                            $location.url('/thankyou');
                        });
                    }else{
                        alert(data.errorMessage.message);
                    }
                });

            }
        }
        Stripe.card.createToken({
            number: $scope.number,
            cvc: $scope.cvc,
            exp_month: $scope.expm,
            exp_year: $scope.expy
        },stripeResponseHandler);   
    };
})