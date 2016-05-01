App.controller('paymentCtrl',function($scope,FlightsSrv,$location){
    $scope.home = function() {
        function stripeResponseHandler(status, response) {
                if (response.error) {
                    alert(response.error.message);
                } 
                else{
                    var token = response.id;
                    var d = new Date($scope.dob);
                    var id = FlightsSrv.returnFlight===undefined?null:FlightsSrv.returnFlight.flightId;
                    FlightsSrv.book(token,$scope.fn,$scope.ln,$scope.number,d.getTime(),$scope.country,FlightsSrv.totalPrice,id).success(function(data){//TODO
                        if(data.errorMessage==null){
                            FlightsSrv.setBrn(data.refNum);
                            $location.url('/thankyou');
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