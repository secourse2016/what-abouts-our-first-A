App.controller('paymentCtrl',function($scope,FlightsSrv,$location){
    $scope.home = function() {
        FlightsSrv.reserve($scope.fn,$scope.ln).success(function (response) {
            FlightsSrv.setBrn(response);
        });
        $location.url('/thankyou');	
    };
})