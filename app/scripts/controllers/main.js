'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calculatorApp
 */
angular.module('calculatorApp')
    .controller('MainCtrl', [ '$scope', function ($scope) {
        //$scope.onNVR = true;
        $scope.NVRObj={
          itemName:'',
          storage:0,
          bandwidth:0,
          cameras:16,
          bitRate:4,
          bitRateData: {
            codec:'H.264',
            quality:'M',
            resolution:'1920x1080',
            FPS:30
            },
          rDays:30,
          motion:50,
          RAID:5,
          HDDsize:3
        };






    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
