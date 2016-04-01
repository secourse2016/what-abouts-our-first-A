App.controller('confirmCtrl',function($scope,$location){

	$scope.text="Are you sure you would like to book this flight?(From Cairo Airport to Madrid Airport)";

	$scope.proceed="payment.html";

    $scope.home = function() {
    $location.url('/');
    };

    $scope.pay = function() {
    $location.url('/payment');
    };
})