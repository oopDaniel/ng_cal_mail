'use strict';


myApp.controller('ItemCtrl', ['$scope', '$stateParams', 'unitConvertFactory', 'localStorageFactory', 'optionsFactory',
    function ($scope, $stateParams, unitConvertFactory, localStorageFactory, optionsFactory) {
        $scope.id      = parseInt($stateParams.id);
        $scope.itemid  = parseInt($stateParams.itemid);
        var inf        = localStorageFactory.pj.getItem($scope.id, $scope.itemid);
        $scope.inf     = inf;
        var isNVR      = inf.type === "NVR";
        $scope.dataURL = isNVR ? "views/NVRdata.html" : "views/CMSdata.html"
        var data       = inf.data;
        $scope.data    = data;
        // var storage    = data.display.storage *  data.cameras;

        function displaySetup () {
            var storage      = unitConvertFactory.getStorage(data.display.storage);
            var bandwidth    = unitConvertFactory.getBandwidth(data.display.bandwidth);
            $scope.storage   = storage[0];
            $scope.sUnit     = storage[1];
            $scope.bandwidth = bandwidth[0];
            $scope.bUnit     = bandwidth[1];
        }
        displaySetup();


        //---------------- HDD -------------------
        $scope.showOtherHDD = false;
        $scope.HDDArr       = optionsFactory.gethddSizeArr();
        $scope.hdd          = optionsFactory.defaultHdd;

        $scope.showHdd = function() {
            var tmp = parseInt($scope.hdd);
            $scope.showOtherHDD = isNaN(tmp);
            if (!$scope.showOtherHDD) {
                data.HDDsize = tmp;
            }
        };

}]);
