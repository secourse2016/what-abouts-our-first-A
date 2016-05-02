App.controller('paymentCtrl',function($scope,FlightsSrv,$location){
    var airlines = {
        "Lufthansa": { 
            "IP": "ec2-54-152-123-100.compute-1.amazonaws.com" 
        },
        "KLM": { 
            "IP": "ec2-52-26-166-80.us-west-2.compute.amazonaws.com" 
        },
        "Emirates Airlines": { 
            "IP": "52.90.46.68" 
        },
        "Air France": { 
            "IP": "52.34.160.140"
        },
        "Swiss Air": { 
            "IP": "www.swiss-air.me"
        },
        "Delta Airlines": { 
            "IP": "52.25.15.124"
        },
        "Japan Airlines": { 
            "IP": "54.187.208.145"
        },
        "Singapore Airlines": { 
            "IP": "sebitsplease.com.s3-website-us-east-1.amazonaws.com"
        },
        "Dragonair": { 
            "IP": "52.58.46.74"
        },
        "Hawaiian": { 
            "IP": "54.93.36.94"
        },
        "Austrian": { 
            "IP": "ec2-52-90-41-197.compute-1.amazonaws.com"
        },
        "South African Airways": { 
            "IP": "54.213.157.185"
        },
        "Malaysia Airlines": { 
            "IP": "52.32.109.147"
        },
        "Northwest Airlines": { 
            "IP": "52.36.169.206"
        },
        "Cathay Pacific Airlines": { 
            "IP": "ec2-52-91-94-227.compute-1.amazonaws.com"
        },
        "Air Madagascar": { 
            "IP": "54.191.202.17"
        },
        "Alaska": { 
            "IP":"52.207.211.179"
        },
        "Turkish Airlines": { 
            "IP": "52.27.150.19"
        },
        "Virgin australia": { 
            "IP": "54.93.116.90"
        },
        "Iberia": { 
            "IP": "52.58.24.76"
        },
        "United": { 
            "IP":"54.187.103.196"
        },
        "AirNewZealand": { 
            "IP":"52.28.246.230"
        }
    }

        
    $scope.home = function() {
        if(FlightsSrv.returnFlight===undefined||FlightsSrv.departFlight.Airline===FlightsSrv.returnFlight.Airline)
        {
            bookOne();
        }
        else
        {
            bookTwo();
        }
        Stripe.setPublishableKey('pk_test_uvzPDBESJ2MJ0cTwAuZDUDfx');

    }
    function bookOne(){
        angular.forEach(airlines , function(value, key) {
            if (key === FlightsSrv.departFlight.Airline) 
            {
                FlightsSrv.getKey(value.IP).success(function(stripeKey){
                    Stripe.setPublishableKey(stripeKey);
                    function stripeResponseHandler(status, response) {
                        if (response.error) {
                            alert(response.error.message);
                        } 
                        else{
                            var token = response.id;
                            var d = new Date($scope.dob);
                            var id = FlightsSrv.returnFlight===undefined?null:FlightsSrv.returnFlight.flightId;
                            FlightsSrv.book(value.IP,token,$scope.fn,$scope.ln,$scope.number,d.getTime(),$scope.country,FlightsSrv.totalPrice,FlightsSrv.departFlight.flightId,id).success(function(data){//TODO
                                if(data.refNum!=null){
                                    FlightsSrv.brn1 = data.refNum;
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
                })
            }
        });
    }
    function bookTwo(){
        angular.forEach(airlines , function(value, key) {
            if (key === FlightsSrv.departFlight.Airline) {
                console.log(FlightsSrv.departFlight.Airline)
                FlightsSrv.getKey(value.IP).success(function(stripeKey){
                    Stripe.setPublishableKey(stripeKey+"");
                    function stripeResponseHandler(status, response) {
                        if (response.error) {
                            alert(response.error.message);
                        } 
                        else{
                            var token = response.id;
                            var d = new Date($scope.dob);
                            FlightsSrv.book(value.IP,token,$scope.fn,$scope.ln,$scope.number,d.getTime(),$scope.country,FlightsSrv.departFlight.cost,FlightsSrv.departFlight.flightId,null).success(function(data){//TODO
                                if(data.refNum!=null)
                                {
                                    FlightsSrv.brn1 = data.refNum;
                                    angular.forEach(airlines , function(value2, key2) {
                                        if (key2 === FlightsSrv.returnFlight.Airline)
                                        {
                                            console.log(FlightsSrv.returnFlight.Airline)
                                            FlightsSrv.getKey(value2.IP).success(function(stripeKey){
                                                Stripe.setPublishableKey(stripeKey+"");
                                                function stripeResponseHandler2(status2, response2) {
                                                    if (response2.error) {
                                                        alert(response2.error.message);
                                                    } 
                                                    else{
                                                        var token = response2.id;
                                                        var d2 = new Date($scope.dob);
                                                        FlightsSrv.book(value2.IP,token,$scope.fn,$scope.ln,$scope.number,d2.getTime(),$scope.country,FlightsSrv.returnFlight.cost,null,FlightsSrv.returnFlight.flightId).success(function(data2){//TODO
                                                            if(data2.refNum!=null){
                                                                FlightsSrv.brn2 = data2.refNum;
                                                                FlightsSrv.airline1 = FlightsSrv.departFlight.Airline;
                                                                FlightsSrv.airline2 = FlightsSrv.returnFlight.Airline;
                                                                $location.url("/thankyou");
                                                            }else{
                                                                alert(data2.refNum);
                                                            }
                                                        });
                                                    }
                                                }
                                                Stripe.card.createToken({
                                                    number: $scope.number,
                                                    cvc: $scope.cvc,
                                                    exp_month: $scope.expm,
                                                    exp_year: $scope.expy
                                                },stripeResponseHandler2);
                                            })
                                        }

                                    });
                                }else
                                {
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
                })
            }
            
        });
    }
})