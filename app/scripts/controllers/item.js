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

        function displaySetup (storage, bandwidth) {
            var tmpS, tmpB;
            if ( -1 === storage || -1 === bandwidth ) {
                tmpS         = unitConvertFactory.getStorage(data.display.storage);
                tmpB         = unitConvertFactory.getBandwidth(data.display.bandwidth);
            } else {
                tmpS         = unitConvertFactory.getStorage(storage);
                tmpB         = unitConvertFactory.getBandwidth(bandwidth);
            }
            $scope.storage   = tmpS[0];
            $scope.sUnit     = tmpS[1];
            $scope.bandwidth = tmpB[0];
            $scope.bUnit     = tmpB[1];
        }
        displaySetup(-1, -1);


        //------------- Counting ----------------






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












    /*****************************************
     *     Define the RAID rule and
     *     count the HDDs needed
     */
        $scope.getMinHDD = function() {
            var minHDD = Math.ceil( $scope.getStorage() / $scope.NVRObj.HDDsize / 1024 );
            switch ( $scope.NVRObj.RAID ) { // RAID Rule
                case "1":
                    minHDD *= 2;
                    break;
                case "5":
                    minHDD += 1;
                    break;
                case "10":
                    minHDD += 2;
                    break;
                default:
            }
            $scope.totalModelSets = Math.ceil( minHDD / 8 );
            return minHDD > 8 ? 8 : minHDD;
        };

        $scope.getMinHDD = function() {
            var minHDD = optionsFactory.getMinHDD(
                        $scope.getStorage(),
                        $scope.NVRObj.HDDsize,
                        $scope.NVRObj.RAID );
            $scope.totalModelSets = minHDD[1];
            return minHDD[0];
        };

    /*****************************************
     *      Checking whether the 'selected' class
     *      should be applied in flexbox
     */
        $scope.RAIDArr = optionsFactory.getRAIDArr();

        $scope.coloringRAID = new Array( $scope.RAIDArr.length );
        // default RAID type
        $scope.coloringRAID[ optionsFactory.defaultRAIDindex ] = true;
        // after clicked on a certain type of RAID
        $scope.updateRAID = function(index, RAIDtype) {
            $scope.coloringRAID.fill(false);
            $scope.coloringRAID[index] = true;
            data.RAID = RAIDtype;
        };








}]);
