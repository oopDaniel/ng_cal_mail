'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the calculatorApp
 */
var myApp = angular.module('MyApp');

myApp.controller('ProjectCtrl', [
    '$scope',
    '$uibModal',
    'storageFactory',
    'alertService',
    function(
        $scope,
        $uibModal,
        storageFactory,
        alertService) {

        var pj = storageFactory.pj;
        $scope.pjArr = pj.projects;
        $scope.nodata = !pj.hasData;
        console.log(pj.hasData)
        $scope.clickArr = [];


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

    }
]);









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
