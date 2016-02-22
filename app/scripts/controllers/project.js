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
        $scope.clickArr  = new Array( pj.projects.length );
        $scope.clickArr.fill(false);

        function arrayInit () {
            $scope.pjRename  = '';
            $scope.pjOldName = '';
        }
        arrayInit();

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

        $scope.select = function (index) {
            $scope.clickArr[index] = !$scope.clickArr[index];
        };


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

        $scope.clickRename = function (name) {
            $scope.pjOldName = name;
            $scope.pjRename  = name;
            $scope.modalInstance = $scope.openModal( "rename", "renameCtrl", "sm" );
        };


/*********************************************************************
                          Redundant
*********************************************************************/
        $scope.openModal = function (template, ctrl, size) {
            return $uibModal.open({
                templateUrl: "views/" + template + ".html",
                size: size,
                controller: ctrl,
                scope: $scope
            });
        };

//********************************************************************

//********************************************************************

        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };

        $scope.$on('fireRename', function(e, newName) {
            localStorageFactory.pj.renamePj($scope.pjOldName, newName);
            arrayInit();
        });

        $scope.clickDelete = function (index) {
            var deleteModal = $scope.openModal( "confirm", "confirmCtrl","sm");
            var id          = pj.projects[index]._id;

            deleteModal.result.then(
                function() {
                    localStorageFactory.pj.deletePj(id);
                },
                function() {
                    $scope.clickArr[index] = !$scope.clickArr[index];
                }
            );
        };



        /* ( Need to figure out other ways )
         *  1. O(N^2), fine all id and push them in an array, then delete item
         *  2. Use Array-object: {id:true},
         *     search all object in the array that has id=true property, then delete item
         */
        // $scope.deleteSelect = function () {
        //     var deleteModal = $scope.openModal( "confirm", "confirmCtrl");

        //     deleteModal.result.then(
        //         function() {
        //             for ( var i in $scope.clickArr ) {
        //                 console.log( "i: "+i);
        //                 if ( $scope.clickArr[i] ) {
        //                     $scope.clickArr[i] = false;
        //                     console.log( "the arr: "+pj.projects[i]);
        //                     var id = pj.projects[i]._id;
        //                     localStorageFactory.pj.deletePj(id);
        //                 }
        //             }
        //         }
        //     );
        // };

}]);


myApp.controller('confirmCtrl', ['$scope', '$uibModalInstance',
    function ($scope, $uibModalInstance) {
        $scope.confirm = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);


myApp.controller('renameCtrl', ['$scope',
    function ($scope) {
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
        };
}]);




myApp.controller('ProjectDetailCtrl', ['$scope', '$stateParams', '$uibModal', 'unitConvertFactory', 'localStorageFactory',
    function ($scope, $stateParams, $uibModal, unitConvertFactory, localStorageFactory) {
        $scope.id     = parseInt($stateParams.id);
        var project   = localStorageFactory.pj.getPj($scope.id);
        $scope.name   = project.name;
        $scope.data   = project.data;
        $scope.nodata = project.data.length === 0;

        function displaySetup () {
            var storage      = unitConvertFactory.getStorage(project.storage);
            var bandwidth    = unitConvertFactory.getBandwidth(project.bandwidth);
            $scope.storage   = storage[0];
            $scope.sUnit     = storage[1];
            $scope.bandwidth = bandwidth[0];
            $scope.bUnit     = bandwidth[1];
        }

        displaySetup();



        $scope.convert   = function (num, onStorage) {
            var result = onStorage ?
                unitConvertFactory.getStorage(num) :
                unitConvertFactory.getBandwidth(num);
            return result[0] + " " + result[1];
        };



        $scope.clickArr  = new Array( project.data.length );
        $scope.clickArr.fill(false);

        $scope.select = function (index) {
            $scope.clickArr[index] = !$scope.clickArr[index];
        };

        $scope.clickDelete = function (index) {
            var deleteModal = $scope.openModal( "confirm", "confirmCtrl","sm");
            var id          = project.data[index]._id;

            deleteModal.result.then(
                function() {
                    localStorageFactory.pj.deleteItem(id, project._id);
                    displaySetup();
                },
                function() {
                    $scope.clickArr[index] = !$scope.clickArr[index];
                }
            );
        };


        $scope.openModal = function (template, ctrl, size) {
            return $uibModal.open({
                templateUrl: "views/" + template + ".html",
                size: size,
                controller: ctrl,
                scope: $scope
            });
        };








}]);
