App.controller('confirmCtrl',function($scope,FlightsSrv,$location){

	$scope.depart = FlightsSrv.getDepartFlight();
	$scope.return = FlightsSrv.getReturnFlight();
    $scope.home = function() {
    $location.url('/');
    };
    $scope.price = parseInt(FlightsSrv.getDepartPrice())*FlightsSrv.getMultiplier()+parseInt(FlightsSrv.getReturnPrice())*FlightsSrv.getMultiplier();
    $scope.timeD = myFunction($scope.depart.date);
    $scope.timeR = myFunction($scope.return.date);
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
        var h = addZero(d.getHours());
        var m = addZero(d.getMinutes());
        return h + ":" + m;
    }
})