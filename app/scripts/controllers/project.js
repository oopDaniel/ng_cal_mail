'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the calculatorApp
 */
var myApp = angular.module('calculatorApp');

myApp.controller('ProjectCtrl', [
    '$scope',
    '$filter',
    '$uibModal',
    'unitConvertFactory',
    'localStorageFactory',
    'fileProcessService',
    'alertService',
    function(
        $scope,
        $filter,
        $uibModal,
        unitConvertFactory,
        localStorageFactory,
        fileProcessService,
        alertService) {

        var pj = localStorageFactory.pj;
        $scope.pjArr = pj.projects;
        $scope.nodata = !pj.hasData;
        $scope.filtText = '';
        $scope.clickArr = [];

//----------------------------------

        $scope.select = function(id) {
            var index = getIndex(id);
            if ( index >= 0 ) {
                $scope.clickArr.splice(index, 1);
            } else {
                $scope.clickArr[$scope.clickArr.length] = id;
            }
        };

        $scope.isSelect = function(id) {
            return getIndex(id) >= 0;
        };

        function getIndex(val) {
            return $scope.clickArr.indexOf(val);
        }

//----------------------------------


        $scope.saveFile = function() {
            if ( 0 === $scope.clickArr.length ) {
                alertService.flash({ type: 'warning', msg: 'Select a project first' });
            } else {
                fileProcessService.saveFile($scope.clickArr);
            }
        };



//----------------------------------

        $scope.totalStorage = function(obj) {
            var result = unitConvertFactory.getTotalStorage(obj);
            return result[0] + ' ' + result[1];
        };

        $scope.totalBandwidth = function(obj) {
            var result = unitConvertFactory.getTotalBandwidth(obj);
            return result[0] + ' ' + result[1];
        };

        $scope.clickRename = function(name) {
            $scope.modalInstance = $scope.openModal('rename', 'renameCtrl', 'sm', true, name);
        };


        $scope.clickDelete = function(index) {
            var deleteModal = $scope.openModal('confirm', 'confirmCtrl', 'sm');
            var id = pj.projects[index]._id;

            deleteModal.result.then(
                function() {
                    localStorageFactory.pj.deletePj(id);
                },
                function() {
                    $scope.clickArr[index] = !$scope.clickArr[index];
                }
            );
        };

        /*********************************************************************
                                  Redundant
        *********************************************************************/
        $scope.openModal = function(template, ctrl, size, isPjName, oldPjName) {
            return $uibModal.open({
                templateUrl: 'views/' + template + '.html',
                size: size,
                controller: ctrl,
                scope: $scope,
                resolve: {
                    isPjName: function() {
                        return isPjName;
                    },
                    oldPjName: function() {
                        return oldPjName;
                    },
                    oldName: function() {
                        return '';
                    }
                }
            });
        };


        //********************************************************************
        //********************************************************************




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
    }
]);




/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Confirm Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




myApp.controller('confirmCtrl', ['$scope', '$uibModalInstance',
    function($scope, $uibModalInstance) {

        $scope.confirm = function() {
            $uibModalInstance.close();
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };

    }
]);





/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Rename Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




myApp.controller('renameCtrl', [
    '$scope',
    'localStorageFactory',
    'isPjName',
    'oldPjName',
    'oldName',
    '$uibModalInstance',
    'alertService',
    function(
        $scope,
        localStorageFactory,
        isPjName,
        oldPjName,
        oldName,
        $uibModalInstance,
        alertService) {


        $scope.pjRename = isPjName ? oldPjName : oldName;
        $scope.emptyName = false;
        $scope.NameExist = false;


        $scope.validCheck = function() {
            $scope.NameExist = false;
            $scope.emptyName = $scope.renameForm.$error.required;
        };

        $scope.renameSubmit = function() {
            if (isPjName &&
                localStorageFactory.pj.renamePj(oldPjName, $scope.pjRename) ||
                !isPjName &&
                localStorageFactory.pj.renameItem(oldPjName, oldName, $scope.pjRename) ) {
                    alertService.flash({ type: 'success', msg: 'Successfully renamed!' });
                    $uibModalInstance.close();
            } else {
                $scope.NameExist = true;
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);





/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                Project details Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// Inherit {$scope.data} from parent controller


myApp.controller('ProjectDetailCtrl', ['$scope', '$state', '$stateParams', '$uibModal', 'unitConvertFactory', 'localStorageFactory',
    function($scope, $state, $stateParams, $uibModal, unitConvertFactory, localStorageFactory) {
        $scope.id = parseInt($stateParams.id);
        var project = localStorageFactory.pj.getPj($scope.id);
        $scope.name = project.name;
        $scope.data = project.data;
        $scope.nodata = project.data.length === 0;

        function displaySetup(onStorage) {
            var num;
            if (onStorage) {
                num = unitConvertFactory.getStorage(project.storage);
                $scope.sUnit = num[1];
            } else {
                num = unitConvertFactory.getBandwidth(project.bandwidth);
                $scope.bUnit = num[1];
            }
            return num[0];
        }

        $scope.showBandwidth = function() {
            return displaySetup(false);
        };

        $scope.showStorage = function() {
            return displaySetup(true);
        };


        $scope.convert = function(num, onStorage) {
            var result;
            if (onStorage) {
                result = unitConvertFactory.getStorage(num);
            } else {
                result = unitConvertFactory.getBandwidth(num);
            }
            return result[0] + ' ' + result[1];
        };



        $scope.clickArr = new Array(project.data.length);
        $scope.clickArr.fill(false);

        $scope.select = function(index) {
            $scope.clickArr[index] = !$scope.clickArr[index];
        };

        $scope.clickDelete = function(index) {
            var deleteModal = $scope.openModal('confirm', 'confirmCtrl', 'sm');
            var id = project.data[index]._id;

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


        $scope.openModal = function(template, ctrl, size, isPjName, oldPjName, oldName) {
            return $uibModal.open({
                templateUrl: 'views/' + template + '.html',
                size: size,
                controller: ctrl,
                scope: $scope,
                resolve: {
                    isPjName: function() {
                        return isPjName;
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

        $scope.clickRename = function(name, isPjName) {
            $scope.modalInstance = isPjName ?
                $scope.openModal('rename', 'renameCtrl', 'sm', isPjName, name) :
                $scope.openModal('rename', 'renameCtrl', 'sm', isPjName, project.name, name);

            $scope.modalInstance.result.then(
                function() {
                    $state.reload();
                });
        };

    }
]);




/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                   Email Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


myApp.controller('MailCtrl', [
    '$scope',
    'fileProcessService',
    '$cordovaEmailComposer',
    function(
        $scope,
        fileProcessService,
        $cordovaEmailComposer) {


    var email = {
        to: 'daniel.chiang@isapsolution.com',
        cc: '',
        bcc: [''],
        subject: 'Cordova Email Test',
        body: 'yo'
    };

    document.addEventListener('deviceready', function() {

        $cordovaEmailComposer.isAvailable().then(function() {
            $scope.sendmail = function() {
                if ( $scope.clickArr.length < 0 ) {
                    window.alert('Select a project first!');
                } else {
                    email.attachments = [ fileProcessService.mailFileStr($scope.clickArr) ];
                    $cordovaEmailComposer.open(email).then(null, function() {
                    });
                }
            };
        }, function() {
            window.alert('Email is not available now!');
        });
    }, false);

}]);
