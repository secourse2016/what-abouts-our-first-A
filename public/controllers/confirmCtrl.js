App.controller('confirmCtrl',function($scope,FlightsSrv,$location){

	$scope.depart = FlightsSrv.getDepartFlight();
	$scope.return = FlightsSrv.getReturnFlight();
    $scope.home = function() {
    $location.url('/');
    };
    FlightsSrv.totalPrice = parseInt(FlightsSrv.getDepartPrice())*FlightsSrv.getMultiplier();
    $scope.price = FlightsSrv.totalPrice;
    $scope.timeD = myFunction($scope.depart.departureDateTime);
    $scope.string="";

    if(FlightsSrv.getHidden()===false){
        $scope.timeR = myFunction($scope.return.departureDateTime);
        $scope.string="Return Flight : "+$scope.timeR+ " from "+$scope.return.origin +" to " +$scope.return.destination;
        FlightsSrv.totalPrice = parseInt(FlightsSrv.getDepartPrice())*FlightsSrv.getMultiplier()+parseInt(FlightsSrv.getReturnPrice())*FlightsSrv.getMultiplier();
        $scope.price = FlightsSrv.totalPrice;
    }
    $scope.pay = function() {
    $location.url('/payment');
    };

    function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
    }

    function myFunction(date) {
        var d = new Date(date);
        var y = d.getFullYear();
        var m = d.getMonth()+1;
        var day = d.getDate();
        return day + "/" + m+ "/"+ y;
    }
})