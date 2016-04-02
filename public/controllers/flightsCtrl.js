App.controller('flightsCtrl',function($scope,$location){
    $scope.return = function() {
    $location.url('/flights2');
    };
})