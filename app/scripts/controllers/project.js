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
        $scope.filtText  = '';

        $scope.arrayProcess = function () {
            $scope.projects  = localStorageFactory.getPjArr();
            $scope.nodata    = false;
            $scope.pjRename  = '';
            $scope.pjOldName = '';
            var length = $scope.projects.length;
            if ( 0 === length ) {
                $scope.nodata = true;
            }
            // Remove the option of 'create' from pj array
            else if ( $scope.projects[ length - 1 ].name ===
                localStorageFactory.defaultNewPjStr ) {
                $scope.projects.pop();
            }
        };
        $scope.arrayProcess();

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

        $scope.totalStorage = function (pj) {
            var storage = 0;
            for ( var i in pj.NVR ) {
                storage += parseFloat(pj.NVR[i].data.display.storage);
            }
            // Not available for CMS
            /*  for ( var i in pj.CMS ) {
                    storage += parseFloat(pj.CMS[i].data.display.storage);
                }
            */
            counter = 0;
            storage = unitConverter(storage);
            return $filter("number")(storage, 1) + " " + storageUnitArr[counter];
        };

        $scope.totalBandwidth = function (pj) {
            var bandwidth = 0;
            for ( var i in pj.NVR ) {
                bandwidth += parseFloat(pj.NVR[i].data.display.bandwidth);
            }
            for ( var i in pj.CMS ) {
                bandwidth += parseFloat(pj.CMS[i].data.display.bandwidth);
            }
            counter = 0;
            bandwidth = unitConverter(bandwidth);
            return $filter("number")(bandwidth, 1) + " " + bandwidthUnitArr[counter];
        };

        $scope.rename = function (pj) {
            $scope.pjOldName = pj.name;
            $scope.pjRename  = pj.name;
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
            // $scope.$apply($scope.arrayProcess());
        };

        $scope.$on('refreshArr', function() {
            $scope.arrayProcess();
        });

}]);


myApp.controller('renameCtrl', ['$scope', '$uibModal','localStorageFactory',
    function ($scope, $uibModal, localStorageFactory) {
        $scope.emptyPjName = false;
        $scope.validCheck = function () {
            if ( $scope.renameForm.$error.required ) {
                $scope.emptyPjName = true;
            } else {
                $scope.emptyPjName = false;
            }
        };

        $scope.renameSubmit = function () {
            localStorageFactory.renamePj($scope.pjOldName, $scope.pjRename);
            $scope.$emit('refreshArr');
            $scope.closeModal();
        };



}]);
