App.controller('confirmCtrl',function($scope,$location){

	// $scope.text=;

	$scope.proceed="payment.html";

    $scope.home = function() {
    $location.url('/');
    };

    $scope.pay = function() {
    $location.url('/payment');
    };
})