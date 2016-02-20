'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the calculatorApp
 */
var myApp = angular.module('calculatorApp');

myApp.controller('ProjectCtrl', ['$scope', '$filter', '$uibModal', 'unitConvertFactory', 'localStorageFactory',
    function ($scope, $filter, $uibModal, unitConvertFactory, localStorageFactory) {
        // $scope.pj        = localStorageFactory.getPj();
        var pj           = localStorageFactory.pj;
        $scope.pjArr     = pj.projects;
        $scope.nodata    = !pj.hasData;
        $scope.filtText  = '';

        $scope.arrayInit = function () {
            $scope.pjRename  = '';
            $scope.pjOldName = '';
            // if ( 0 === length ) {
            //     $scope.nodata = true;
            // }
            // Remove the option of 'create' from pj array
        };
        $scope.arrayInit();

        // var counter;
        // var storageUnitArr   = ["GB","TB","PB"];
        // var bandwidthUnitArr = ["Mbps","Gbps","Tbps"];
        // var unitConverter = function (num) {
        //     if ( num > 10240 ) {
        //         counter++;
        //         return unitConverter( num / 1024 );
        //     }
        //     return num;
        // };

        $scope.totalStorage = function (obj) {
            // var storage = 0;
            // for ( var i in obj.NVR ) {
            //     storage += parseFloat(obj.NVR[i].data.display.storage);
            // }
            // counter = 0;
            // storage = unitConverter(storage);
            // return $filter("number")(storage, 1) + " " + storageUnitArr[counter];
            unitConvertFactory.setData(obj);
            var result = unitConvertFactory.getTotalStorage();
            return result[0] + " " + result[1];
        };

        $scope.totalBandwidth = function (obj) {
            // var bandwidth = 0;
            // for ( var i in obj.NVR ) {
            //     bandwidth += parseFloat(obj.NVR[i].data.display.bandwidth);
            // }
            // for ( var i in obj.CMS ) {
            //     bandwidth += parseFloat(obj.CMS[i].data.display.bandwidth);
            // }
            // counter = 0;
            // bandwidth = unitConverter(bandwidth);
            // return $filter("number")(bandwidth, 1) + " " + bandwidthUnitArr[counter];
            unitConvertFactory.setData(obj);
            var result = unitConvertFactory.getTotalBandwidth();
            return result[0] + " " + result[1];
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
            localStorageFactory.pj.renamePj($scope.pjOldName, newName);
            // localStorageFactory.setPj( $scope.pj );
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




myApp.controller('projectDetailCtrl', ['$scope', '$stateParams', 'unitConvertFactory', 'localStorageFactory',
    function ($scope, $stateParams, unitConvertFactory, localStorageFactory) {
        var project      = localStorageFactory.pj.getPj(parseInt($stateParams.id));
        $scope.data      = project.data;
        var storage      = unitConvertFactory.getStorage(project.storage);
        var bandwidth    = unitConvertFactory.getBandwidth(project.bandwidth);
        $scope.storage   = storage[0];
        $scope.sUnit     = storage[1];
        $scope.bandwidth = bandwidth[0];
        $scope.bUnit     = bandwidth[1];

        $scope.convert   = function (num) {
            var result = unitConvertFactory.getStorage(num);
            return result[0] + " " + result[1];
        }


}]);
