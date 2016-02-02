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
        $scope.setRAID[2] = true;       // Default RAID type
        // when clicking the type of RAID
        $scope.selectRAID = function(index) {
            $scope.setRAID.fill(false);
            $scope.setRAID[index] = true;
            if ( index < 2 )
                $scope.NVRObj.RAID = index;
            else
                $scope.NVRObj.RAID = 2 === index ? 5 : 6;
        };

        $scope.setHDD = new Array(6);
        $scope.setHDD[2] = true;        // Default HDD size
        $scope.showOtherHDD = false;
        var HDDArr = [1,2,3,4,6];       // HDD size indicator
        $scope.selectHDD = function(index) {
            $scope.setHDD.fill(false);
            $scope.setHDD[index] = true;
            if ( 5 === index ) {
                $scope.showOtherHDD = true;
            } else {
                $scope.showOtherHDD = false;
                $scope.NVRObj.HDDsize = HDDArr[index];
            }
        };

        $scope.getBandwidth = function() {
            $scope.NVRObj.bandwidth =
                $scope.NVRObj.cameras * $scope.NVRObj.bitRate;
            return $scope.NVRObj.bandwidth;
        };
        $scope.getStorage = function() {
            $scope.NVRObj.storage = $scope.NVRObj.bandwidth *
                $scope.NVRObj.rDays * $scope.NVRObj.motion / 100;
            return $scope.NVRObj.storage;
        };
        $scope.getMinHDD = function() {
            var minHDD = $scope.NVRObj.storage / $scope.NVRObj.HDDsize / 1024;
            minHDD = minHDD === (minHDD | 0) ?  // Ceiling
                minHDD : ( minHDD | 0 ) + 1;
            switch ( $scope.NVRObj.RAID ) {
                case 1:
                    minHDD *= 2;
                    break;
                case 5:
                    minHDD += 1;
                    break;
                case 6:
                    minHDD += 2;
                    break;
                default:
            }
            return minHDD;
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



    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
