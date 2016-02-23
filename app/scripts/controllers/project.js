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
        var pj           = localStorageFactory.pj;
        $scope.pjArr     = pj.projects;
        $scope.nodata    = !pj.hasData;
        $scope.filtText  = '';
        $scope.clickArr  = new Array( pj.projects.length );
        $scope.clickArr.fill(false);



        $scope.select = function (index) {
            $scope.clickArr[index] = !$scope.clickArr[index];
        };


        $scope.totalStorage = function (obj) {
            unitConvertFactory.setData(obj);
            var result = unitConvertFactory.getTotalStorage();
            return result[0] + " " + result[1];
        };

        $scope.totalBandwidth = function (obj) {
            unitConvertFactory.setData(obj);
            var result = unitConvertFactory.getTotalBandwidth();
            return result[0] + " " + result[1];
        };

        $scope.clickRename = function (name) {
            $scope.modalInstance = $scope.openModal( "rename", "renameCtrl", "sm", true, name );
        };


/*********************************************************************
                          Redundant
*********************************************************************/
        $scope.openModal = function  (template, ctrl, size, isPjName, oldName ) {
            return $uibModal.open({
                templateUrl: "views/" + template + ".html",
                size: size,
                controller: ctrl,
                scope: $scope,
                resolve: {
                    isPjName: function() {
                        return isPjName;
                    },
                    oldPjName: function() {
                        return oldName;
                    }
                }
            });
        };

//********************************************************************
//********************************************************************

        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };


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




/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Confirm Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




myApp.controller('confirmCtrl', ['$scope', '$uibModalInstance',
    function ($scope, $uibModalInstance ) {

        $scope.confirm = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

}]);





/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Rename Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




myApp.controller('renameCtrl', ['$scope', 'localStorageFactory', 'isPjName', 'oldPjName',
    function ($scope, localStorageFactory, isPjName, oldPjName) {
        $scope.pjRename  = oldPjName;
        $scope.emptyPjName = false;

        $scope.validCheck = function () {
            $scope.emptyPjName = $scope.renameForm.$error.required;
        };

        $scope.renameSubmit = function () {
            localStorageFactory.pj.renamePj(oldPjName, $scope.pjRename);
            $scope.closeModal();
        };

}]);





/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Project details Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Inherit {$scope.data} from parent controller


myApp.controller('ProjectDetailCtrl', ['$scope', '$stateParams', '$uibModal', 'unitConvertFactory', 'localStorageFactory',
    function ($scope, $stateParams, $uibModal, unitConvertFactory, localStorageFactory) {
        $scope.id     = parseInt($stateParams.id);
        var project   = localStorageFactory.pj.getPj($scope.id);
        $scope.name   = project.name;
        $scope.data   = project.data;
        $scope.nodata = project.data.length === 0;

        function displaySetup (onStorage) {
            if ( onStorage ) {
                var num      = unitConvertFactory.getStorage(project.storage);
                $scope.sUnit = num[1];
            } else {
                var num      = unitConvertFactory.getBandwidth(project.bandwidth);
                $scope.bUnit = num[1];
            }
            return num[0];
        }

        $scope.showBandwidth = function () {
            return displaySetup( false );
        };

        $scope.showStorage = function () {
            return displaySetup( true );
        };


        $scope.convert   = function (num, onStorage) {
            if ( onStorage ) {
                var result = unitConvertFactory.getStorage(num);
            } else {
                var result = unitConvertFactory.getBandwidth(num);
            }
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
