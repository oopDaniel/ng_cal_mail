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

        // for checking whether should the class be applied
        $scope.setRAID = new Array(4);

        // click a type of RAID
        $scope.selectRAID = function(index) {
            $scope.setRAID.fill(false);
            $scope.setRAID[index] = true;
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
        $scope.otherDuration = false;
        //
        $scope.selectDays = function() {
            var tmp = parseInt($scope.rDays.name);
            if ( isNaN(tmp) ) {
                $scope.otherDuration = true;
            } else {
                $scope.otherDuration = false;
                $scope.NVRObj.rDays = tmp;
            }
        };





    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
