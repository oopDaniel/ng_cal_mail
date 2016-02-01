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
          storage:960,
          bandwidth:64,
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

        // for checking whether should the class be applied
        $scope.setRAID = new Array(4);

        // click a type of RAID
        $scope.selectRAID = function(index) {
            $scope.setRAID.fill(false);
            $scope.setRAID[index] = true;
        };

        $scope.setHDD = new Array(6);
        $scope.showOtherHDD = false;
        var HDDArr = [1,2,3,4,6];
        $scope.selectHDD = function(index) {
            $scope.showOtherHDD =
              5 === index ? true : false;
            $scope.setHDD.fill(false);
            $scope.setHDD[index] = true;
            if ( 5 === index ) {
                $scope.showOtherHDD = true;
            } else {
                $scope.showOtherHDD = false;
                $scope.NVRObj.HDDsize = HDDArr[index];
            }
        };


        $scope.rDaysArr = [
            {name:'1 day'},
            {name:'2 days'},
            {name:'4 days'},
            {name:'7 days (1 week)'},
            {name:'14 days (2 weeks)'},
            {name:'30 days (1 month)'},
            {name:'60 days (2 months)'},
            {name:'90 days (3 months)'},
            {name:'Other duration'}
        ];
        // set the default value for the combo box
        $scope.rDays = {name:'30 days (1 month)'};
        // display the textarea for other duration
        $scope.showOtherDuration = false;

        $scope.selectDays = function() {
            var tmp = parseInt($scope.rDays.name);
            if ( isNaN(tmp) ) {
                $scope.showOtherDuration = true;
            } else {
                $scope.showOtherDuration = false;
                $scope.NVRObj.rDays = tmp;
            }
        };
        console.log($scope.minHDD = $scope.NVRObj.storage / $scope.NVRObj.HDDsize / 1024);





    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
