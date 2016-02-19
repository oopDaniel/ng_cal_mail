'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the calculatorApp
 */
var myApp = angular.module('calculatorApp');

myApp.controller('ProjectCtrl', ['$scope', '$filter', '$uibModal', 'localStorageFactory',
    function ($scope, $filter, $uibModal, localStorageFactory) {
        $scope.pj        = localStorageFactory.getPj();
        $scope.projects  = $scope.pj.projects;
        console.log($scope.pj.hasData);
        $scope.nodata    = !$scope.pj.hasData;
        $scope.filtText  = '';

        $scope.arrayInit = function () {

            $scope.pjRename  = '';
            $scope.pjOldName = '';
            var length = $scope.pj.projects.length;
            // if ( 0 === length ) {
            //     $scope.nodata = true;
            // }
            // Remove the option of 'create' from pj array
            console.log($scope.pj.projects);
            if ( $scope.pj.hasData ) {
                if ( $scope.pj.projects[ length - 1 ].name ===
                    localStorageFactory.defaultNewPjStr ) {
                    $scope.pj.projects.pop();
                }
            }
        };
        $scope.arrayInit();

        var counter;
        var storageUnitArr   = ["GB","TB","PB"];
        var bandwidthUnitArr = ["Mbps","Gbps","Tbps"];
        var unitConverter = function (num) {
            if ( num > 10240 ) {
                counter++;
                return unitConverter( num / 1024 );
            }
            return num;
        };

        $scope.totalStorage = function (obj) {
            var storage = 0;
            for ( var i in obj.NVR ) {
                storage += parseFloat(obj.NVR[i].data.display.storage);
            }
            counter = 0;
            storage = unitConverter(storage);
            return $filter("number")(storage, 1) + " " + storageUnitArr[counter];
        };

        $scope.totalBandwidth = function (obj) {
            var bandwidth = 0;
            for ( var i in obj.NVR ) {
                bandwidth += parseFloat(obj.NVR[i].data.display.bandwidth);
            }
            for ( var i in obj.CMS ) {
                bandwidth += parseFloat(obj.CMS[i].data.display.bandwidth);
            }
            counter = 0;
            bandwidth = unitConverter(bandwidth);
            return $filter("number")(bandwidth, 1) + " " + bandwidthUnitArr[counter];
        };

        $scope.clickRename = function (obj) {
            $scope.pjOldName = obj.name;
            $scope.pjRename  = obj.name;
            $scope.openModal( "rename", "renameCtrl", "sm" );
        };



        $scope.openModal = function (template, ctrl, size) {
            $scope.modalInstance = $uibModal.open({
                templateUrl: "views/" + template + ".html",
                size: size,
                controller: ctrl,
                scope: $scope
            });
        };

        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };

        $scope.$on('fireRename', function(e, newName) {
            $scope.pj.renamePj($scope.pjOldName, newName);
            localStorageFactory.setPj( $scope.pj );
            $scope.arrayInit();
        });

}]);


myApp.controller('renameCtrl', ['$scope', '$uibModal',
    function ($scope, $uibModal) {
        $scope.emptyPjName = false;
        $scope.validCheck = function () {
            $scope.emptyPjName = $scope.renameForm.$error.required;
        };

        $scope.renameSubmit = function () {
            $scope.$emit('fireRename', returnName());
            $scope.closeModal();
        };

        var returnName = function () {
            return $scope.pjRename;
        }

}]);




myApp.controller('projectDetailCtrl', ['$scope', '$uibModal','localStorageFactory',
    function ($scope, $uibModal, localStorageFactory) {
        // $scope.emptyPjName = false;
        // $scope.validCheck = function () {
        //     if ( $scope.renameForm.$error.required ) {
        //         $scope.emptyPjName = true;
        //     } else {
        //         $scope.emptyPjName = false;
        //     }
        // };

        // $scope.renameSubmit = function () {
        //     localStorageFactory.renamePj($scope.pjOldName, $scope.pjRename);
        //     $scope.$emit('refreshArr');
        //     $scope.closeModal();
        // };

}]);
