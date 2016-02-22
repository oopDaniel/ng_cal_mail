'use strict';


myApp.controller('ItemCtrl', ['$scope', '$state', '$stateParams', 'unitConvertFactory', 'localStorageFactory', 'optionsFactory',
    function ($scope, $state, $stateParams, unitConvertFactory, localStorageFactory, optionsFactory) {
        $scope.id      = parseInt($stateParams.id);
        $scope.itemid  = parseInt($stateParams.itemid);
        var inf        = localStorageFactory.pj.getItem($scope.id, $scope.itemid);
        $scope.inf     = inf;
        var isNVR      = inf.type === "NVR";
        $scope.dataURL = isNVR ? "views/NVRdata.html" : "views/CMSdata.html"
        var data       = inf.data;
        $scope.data    = data;


        function displaySetup (num, onStorage) {
            var tmp;
            if ( onStorage ) {
                tmp = unitConvertFactory.getStorage(num);
                $scope.sUnit = tmp[1];
            } else {
                tmp = unitConvertFactory.getBandwidth(num);
                $scope.bUnit = tmp[1];
            }
            return tmp[0];
        }

        //------------- Counting ----------------

        function getBandwidth() {
            return data.cameras * data.bitRate.data;
        };

        $scope.showBandwidth = function () {
            return displaySetup( getBandwidth(), false );
        };

        function getStorage () {
            return getBandwidth() * 0.125 * // to MB/s
              60 * 60 * 24 / 1024 * data.estDays.data;
        };

        $scope.showStorage = function () {
            return displaySetup( getStorage(), true );
        }

        //---------------- HDD -------------------
        $scope.showOtherHDD = false;
        $scope.HDDArr       = optionsFactory.gethddSizeArr();
        var t = $scope.HDDArr.indexOf(data.HDDsize);
        console.log(data)
        $scope.hdd = $scope.HDDArr[ t ];
        $scope.hddInput = ''

        $scope.showHdd = function() {
            $scope.showOtherHDD = isNaN( parseInt($scope.hdd) );
            if (!$scope.showOtherHDD) {
                data.HDDsize = $scope.hdd;
            }
        };

        $scope.editHdd = function() {
            data.HDDsize = parseInt($scope.hddInput) + " TB";
        };


    /*****************************************
     *     Define the RAID rule and
     *     count the HDDs needed
     */
        $scope.getMinHDD = function() {
            // console.log($scope.getStorage()+" "+data.HDDsize+" "+data.RAID)
            var minHDD = optionsFactory.getMinHDD(
                        getStorage(),
                        data.HDDsize,
                        data.RAID );
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

    //---------------------------------------------
    //---------------------------------------------


    $scope.saveEdit = function () {
        data.display.storage   = getStorage();
        data.display.bandwidth = getBandwidth();
        localStorageFactory.pj.editItem( $scope.id, $scope.itemid,
                                         data, true );
        $scope.alerts.push({ type: 'success', msg: 'Successfully saved!' });
    };

    $scope.refresh = function () {
        $state.go($state.current, {}, {reload: true});
    }


    //--------------  alert   ----------------
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

}]);
