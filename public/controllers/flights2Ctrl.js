App.controller('flights2Ctrl',function($scope,$location){
    $scope.confirm = function() {
    $location.url('/confirm');
    };
})