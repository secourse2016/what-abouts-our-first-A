/**
* Main Controller
*/
App.controller('mainCtrl', function($scope, FlightsSrv, $location, $log) {

/*----------- Angular Bootstrap Datepicker -----------*/
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.open1 = function() {
    $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
    $scope.popup2.opened = true;
    };

    $scope.setDate1 = function(year, month, day) {
    $scope.dt1 = new Date(year, month, day);
    };

    $scope.setDate2 = function(year, month, day) {
    $scope.dt2 = new Date(year, month, day);
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

    /* Record User's Selected Origin Airport  */
    $scope.SetOriginAirport = function(originAirport) {
    FlightsSrv.setSelectedOriginAirport(originAirport);
    };

    /* Record User's Selected Destination Airport  */
    $scope.SetDestinationAirport = function(destAirport) {
    FlightsSrv.setSelectedDestinationAirport(destAirport);
    };

    /* Find All Available Flights  */
    $scope.SearchFlights = function() {
    $location.url('/confirm');
    };

    /* Get Airports on page render  */
    AirportCodes();

});
