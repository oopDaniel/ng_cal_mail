'use strict';


angular.module('calculatorApp').controller('ItemCtrl',
    ['$scope', '$state', '$stateParams', '$uibModal', 'unitConvertFactory', 'localStorageFactory', 'optionsFactory',
    function ($scope, $state, $stateParams, $uibModal, unitConvertFactory, localStorageFactory, optionsFactory) {
        $scope.id      = parseInt($stateParams.id);
        $scope.itemid  = parseInt($stateParams.itemid);
        var pj         = localStorageFactory.pj.getPj($scope.id);
        var inf        = localStorageFactory.pj.getItem($scope.id, $scope.itemid);
        var onNVR      = inf.type === "NVR";
        var data       = inf.data;
        $scope.inf     = inf;
        $scope.onNVR   = onNVR;
        $scope.dataURL = "views/dataForm.html";
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
            return onNVR ?
                data.cameras * data.bitRate.data :
                data.cameras * data.bitRate.data * data.remoteUsers;
        }

        $scope.showBandwidth = function () {
            return displaySetup( getBandwidth(), false );
        };

        function getStorage () {
            return onNVR ? getBandwidth() * 0.125 * // to MB/s
              60 * 60 * 24 / 1024 * data.estDays.data : 0;
        }

        $scope.showStorage = function () {
            return parseInt(displaySetup( getStorage(), true )) || "- ";
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
            minHDD[1]  = minHDD[1] || 1;
            minHDD[0]  = minHDD[0] || 1;
            $scope.totalModelSets = minHDD[1];
            return minHDD[0];
        };

        // Fix the display bug in CMS tab
        $scope.hddSizeDisplay = function() {
            data.HDDsize = data.HDDsize || "1 TB";
            return data.HDDsize;
        };


    //---------------------------------------------
    //---------------------------------------------


    $scope.saveEdit = function () {
        data.display.storage   = getStorage();
        data.display.bandwidth = getBandwidth();
        if (localStorageFactory.pj.editItem(
            $scope.id, $scope.itemid, data)) {
            $scope.alerts.push({ type: 'success', msg: 'Successfully saved!' });
        }
    };


    //--------------  alert   ----------------
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };


    //--------------  Rename  ----------------

    $scope.clickRename = function (name) {
        $scope.modalInstance =
            $scope.openModal( "rename", "renameCtrl", "sm", pj.name , name );
    };

    $scope.openModal = function  (template, ctrl, size, oldPjName, oldName ) {
        return $uibModal.open({
            templateUrl: "views/" + template + ".html",
            size: size,
            controller: ctrl,
            scope: $scope,
            resolve: {
                isPjName: function() {
                    return false;
                },
                oldPjName: function() {
                    return oldPjName;
                },
                oldName: function() {
                    return oldName;
                }

            }
        });
    };


    $scope.$on('$locationChangeStart', function() {
        localStorageFactory.refresh();
        $state.reload();
    });

}]);
