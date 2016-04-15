App.controller('mainCtrl', function($scope, FlightsSrv, $location, $log) {

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.radioModel2 = "";
    $scope.radioModel1 = "";

    $scope.hidden = false;

    $scope.alerts = [];
    
    $scope.one = function() {
        $scope.hidden = true;
    };

    $scope.round = function() {
        $scope.hidden = false;
    };

    $scope.closeAlert = function() {
    $scope.alerts.splice(0, 1);
    };

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

    $scope.SearchFlights = function() {
        $scope.alerts = [];
        if($scope.selectedP==="Persons"){
            FlightsSrv.setMultiplier(1);
        }
        else{
            FlightsSrv.setMultiplier($scope.selectedP);
        }
        if($scope.selectedC==="Cabin"||$scope.selectedC==="Economy"){
            FlightsSrv.setCabin("Economy");
        }
        else{
            FlightsSrv.setCabin("First");
        }
        if($scope.selectedDestination === undefined || $scope.selectedOrigin === undefined)
        {
            $scope.alerts.push({ type: 'danger', msg: 'Yalahwy! You forgot to choose an airport :(' });
            return;
        }

        if($scope.dt1 === undefined || ($scope.dt2 === undefined && !$scope.hidden))
        {
            $scope.alerts.push({ type: 'danger', msg: 'Yalahwy! You forgot to choose a date :(' });
            return;
        }

        if($scope.radioModel1 == "")
        {
            $scope.alerts.push({ type: 'danger', msg: 'Yalahwy! You forgot to choose the type of trip :(' });
            return;
        }

        if($scope.radioModel2 == "")
        {
            $scope.alerts.push({ type: 'danger', msg: 'Yalahwy! You forgot to choose which airline to search from :(' });
            return;
        }
        FlightsSrv.setSelectedOriginAirport($scope.selectedOrigin);
        FlightsSrv.setSelectedDestinationAirport($scope.selectedDestination);
        FlightsSrv.setReturnDate($scope.dt2);
        FlightsSrv.setDepartDate($scope.dt1); 
        $location.url('/flights');
    };

    AirportCodes();

});
