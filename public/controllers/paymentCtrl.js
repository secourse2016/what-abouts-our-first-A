App.controller('paymentCtrl',function($scope,$location){
    $scope.home = function() {
    	Fn=$scope.fn;
        FlightsSrv.setFn(Fn);
    	Ln =$scope.ln;
        FlightsSrv.setLn(Fn);
        FlightsSrv.reserves();
        console.log('reserved');
        $location.url('/');

    };

    //  $scope.setFn=function(Fn){
    //  	Fn=$scope.fn;
    //     FlightsSrv.setFn(Fn);
    // }
    // $scope.setLn=function(Ln){
    // 	Ln =$scope.ln;
    //     FlightsSrv.setLn(Fn);
    // }
})