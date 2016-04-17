App.controller('paymentCtrl',function($scope,FlightsSrv,$location){
    $scope.home = function() {
		
    	// console.log('reserved');
    	// Fn=$scope.fn;
         FlightsSrv.setFn("hi");
    	// Ln =$scope.ln;
         FlightsSrv.setLn("$scope.ln");
          FlightsSrv.reserves();
         $location.url('/');	
     //    FlightsSrv.reserves();
     //    console.log('reserved');
        

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