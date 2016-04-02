App.controller('confirmCtrl',function($scope,$location){

	$scope.text="";

    $scope.home = function() {
    $location.url('/');
    };

    $scope.pay = function() {
    $location.url('/payment');
    };
})