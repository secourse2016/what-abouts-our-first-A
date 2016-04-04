App.controller('mainCtrl', function($scope, FlightsSrv, $location, $log) {

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.status = {
        isopenP: false,isopenC:false
    };

    $scope.selectedP = "Persons";

    $scope.selectNum = function(num) {
        $scope.selectedP = num;
    }

    $scope.selectedC = "Cabin";

    $scope.selectCabin = function(cabin) {
        $scope.selectedC = cabin;
    }

    $scope.toggleDropdownP = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopenP = !$scope.status.isopenP;
    };

    $scope.toggleDropdownC = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopenC = !$scope.status.isopenC;
    };

    function AirportCodes() {
    FlightsSrv.getAirportCodes().success(function(airports) {
         $scope.Airports = airports;
     });
    };

    $scope.SetOriginAirport = function(originAirport) {
        FlightsSrv.setSelectedOriginAirport(originAirport);
    };

    $scope.SetDestinationAirport = function(destAirport) {
        FlightsSrv.setSelectedDestinationAirport(destAirport);
    };

    $scope.SearchFlights = function() {
        if($scope.selectedP==="Persons"){
            FlightsSrv.setMultiplier(1);
        }
        else{
            FlightsSrv.setMultiplier($scope.selectedP);
        }
        FlightsSrv.setReturnDate($scope.dt2);
        FlightsSrv.setDepartDate($scope.dt1);
        if($scope.selectedC==="Cabin"||$scope.selectedC==="Economy"){
            FlightsSrv.setCabin("Economy");
        }
        else{
            FlightsSrv.setCabin("First");
        }
        $location.url('/flights');
    };

    AirportCodes();

});
