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
        $scope.onNVR = true;  // else on CMS
        $scope.storageDisplay = 0;
        $scope.bandwidthDisplay = 0;
        $scope.storageUnit = 'GB';
        $scope.bandwidthUnit = 'Mbps';
        $scope.modelSets = 1;
        $scope.estDays = 4;
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
          rHours:16,
          motion:50,
          RAID:5,
          HDDsize:3
        };
        $scope.CMSObj={
          itemName:'',
          storage:'-',
          bandwidth:64,
          cameras:16,
          bitRate:4,
          bitRateData: {
            codec:'H.264',
            quality:'M',
            resolution:'1920x1080',
            FPS:30
            },
          local:true,
          remoteUsers:10
        };

        // for switch tab
        $scope.whereami = function(toNVR) {
            $scope.onNVR = toNVR;
        };
        $scope.getEstDays = function() {
            $scope.NVRObj.rHours = $scope.NVRObj.rHours > 24 ?
              24 : $scope.NVRObj.rHours;
            $scope.estDays = $scope.NVRObj.rDays *
              $scope.NVRObj.motion / 100 *
              $scope.NVRObj.rHours / 24;
            return Math.ceil($scope.estDays);
        };
        $scope.getBandwidth = function() {
            $scope.bandwidthDisplay = $scope.onNVR ?
              $scope.NVRObj.cameras * $scope.NVRObj.bitRate :
              $scope.CMSObj.cameras * $scope.CMSObj.bitRate * $scope.CMSObj.remoteUsers;
            if ( $scope.bandwidthDisplay > 1024 * 1024 * 10 )
                $scope.bandwidthUnit = 'Tbps';
            else if ( $scope.bandwidthDisplay > 10240)
                $scope.bandwidthUnit = 'Gbps';
            else
                $scope.bandwidthUnit = 'Mbps';
            return $scope.bandwidthDisplay;
        };
        $scope.getStorage = function() {
            $scope.storageDisplay = $scope.onNVR ?
              $scope.bandwidthDisplay * 0.125 // to MB/s
              * 60 * 60 * 24 / 1024 // to GB/day
              * $scope.getEstDays() : 0;
            if ( $scope.storageDisplay > 1024 * 1024 * 10 )
                $scope.storageUnit = 'PB';
            else if ( $scope.storageDisplay > 10240)
                $scope.storageUnit = 'TB';
            else
                $scope.storageUnit = 'GB';
            return $scope.storageDisplay;
        };
        $scope.getMinHDD = function() {
            var minHDD = Math.ceil( $scope.storageDisplay / $scope.NVRObj.HDDsize / 1024 );
            switch ( $scope.NVRObj.RAID ) { // RAID Rule
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
            $scope.modelSets = Math.ceil( minHDD / 8 );
            return minHDD > 8 ? 8 : minHDD;
        };

        // for checking whether should the class be applied
        $scope.settingRAID = new Array(4);
        $scope.settingRAID[2] = true;       // Default RAID type
        // when clicking the type of RAID
        $scope.selectRAID = function(index) {
            $scope.settingRAID.fill(false);
            $scope.settingRAID[index] = true;
            if ( index < 2 ) {
                $scope.NVRObj.RAID = index;
            } else {
                $scope.NVRObj.RAID = 2 === index ? 5 : 6;
            }
        };

        $scope.settingHDD = new Array(6);
        $scope.settingHDD[2] = true;        // Default HDD size
        $scope.showOtherHDD = false;
        var HDDArr = [1,2,3,4,6];       // HDD size indicator
        $scope.selectHDD = function(index) {
            $scope.settingHDD.fill(false);
            $scope.settingHDD[index] = true;
            if ( 5 === index ) {
                $scope.showOtherHDD = true;
            } else {
                $scope.showOtherHDD = false;
                $scope.NVRObj.HDDsize = HDDArr[index];
            }
        };

        // ---------  Bit Rate Panel --------- \\

        $scope.onEstDays = false;


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
        $scope.rDays = $scope.rDaysArr[5];
        // display the textarea for other duration
        $scope.showOtherDuration = false;

        $scope.selectDays = function() {
            var tmp = parseInt($scope.rDays.name);
            if ( isNaN(tmp) )
                $scope.showOtherDuration = true;
            else {
                $scope.showOtherDuration = false;
                $scope.NVRObj.rDays = tmp;
            }
        };

        // ------------  CMS  ------------ \\

        $scope.isLocal = true;
        $scope.selectLocal = function(onLocal) {
            $scope.isLocal = onLocal;
        };



    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
