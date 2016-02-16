'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calculatorApp
 */
angular.module('calculatorApp')
    .controller('MainCtrl', [ '$scope', 'bitrateFactory', 'menuFactory',
      function ($scope, bitrateFactory, menuFactory) {
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
            quality:'Medium',
            resolution:'Full HD (1920 x 1080)',
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
            quality:'Medium',
            resolution:'Full HD (1920 x 1080)',
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
            validCheck('hours');
            $scope.estDays = $scope.NVRObj.rDays *
              $scope.NVRObj.motion / 100 *
              $scope.NVRObj.rHours / 24;
            return Math.ceil($scope.estDays);
        };
        $scope.getBandwidth = function() {
            if ( $scope.onNVR ) {
                $scope.bandwidthDisplay = $scope.NVRObj.cameras * $scope.getBitRate();
            } else {
                // validCheck('cmsCameras');
                $scope.bandwidthDisplay = $scope.CMSObj.cameras * $scope.getBitRate() * $scope.CMSObj.remoteUsers;
            }
            validCheck('bandwidthUnit');
            return $scope.bandwidthDisplay;
        };
        $scope.getStorage = function() {
            $scope.storageDisplay = $scope.onNVR ?
              $scope.bandwidthDisplay * 0.125 * // to MB/s
              60 * 60 * 24 / 1024 * $scope.getEstDays() : 0;
            validCheck('storageUnit');
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
                case 10:
                    minHDD += 2;
                    break;
                default:
            }
            $scope.modelSets = Math.ceil( minHDD / 8 );
            return minHDD > 8 ? 8 : minHDD;
        };

        // for checking whether should the 'selected' class be applied
        $scope.settingRAID = new Array(4);
        // default RAID type
        $scope.settingRAID[2] = true;
        // after clicked the type of RAID
        $scope.selectRAID = function(index) {
            $scope.settingRAID.fill(false);
            $scope.settingRAID[index] = true;
            if ( index < 2 ) {
                $scope.NVRObj.RAID = index;
            } else {
                $scope.NVRObj.RAID = 2 === index ? 5 : 10;
            }
        };

        var validCheck = function(index) {
            switch ( index ) {
                // case 'cmsCameras':  // At most 128
                //     $scope.CMSObj.cameras = $scope.CMSObj.cameras > 128 ?
                //         128 : $scope.CMSObj.cameras;
                //     break;
                case 'storageUnit':
                    if ( $scope.storageDisplay > 1024 * 1024 * 10 )
                        $scope.storageUnit = 'PB';
                    else if ( $scope.storageDisplay > 10240)
                        $scope.storageUnit = 'TB';
                    else
                        $scope.storageUnit = 'GB';
                    break;
                case 'bandwidthUnit':
                    if ( $scope.bandwidthDisplay > 1024 * 1024 * 10 )
                        $scope.bandwidthUnit = 'Tbps';
                    else if ( $scope.bandwidthDisplay > 10240)
                        $scope.bandwidthUnit = 'Gbps';
                    else
                        $scope.bandwidthUnit = 'Mbps';
                    break;
                case 'hours':
                    $scope.NVRObj.rHours = $scope.NVRObj.rHours > 24 ?
                        24 : $scope.NVRObj.rHours;

                    break;
                default:
            }
        };


        $scope.rdaysEmpty = $scope.rhoursEmpty = $scope.hddEmpty = false;
        $scope.required = function() {
            $scope.rdaysEmpty = $scope.showOtherDuration && '' === $scope.NVRObj.rDays;
            $scope.hddEmpty = $scope.showOtherHDD && '' === $scope.NVRObj.HDDsize;
            $scope.rhoursEmpty = '' === $scope.NVRObj.rHours;
        };


        // ------------  Panel ------------ \\

        $scope.onEstDays = $scope.onBitRate = $scope.onCMSBitRate = false;
        $scope.rDaysArr = menuFactory.getRDaysArr();
        // set the default value for the combo box
        $scope.rDays = $scope.rDaysArr[5];
        // display the textarea for other duration
        $scope.showOtherDuration = false;

        $scope.HDDArr = menuFactory.gethddSizeArr();
        $scope.hdd = $scope.HDDArr[2];

        $scope.withOtherOption = function(item,where) {
            var tmp = parseInt(item);
            if ( 0 === where ) { // rDays
                $scope.showOtherDuration = isNaN(tmp);
                if (!$scope.showOtherDuration)
                    $scope.NVRObj.rDays = tmp;
            } else if ( 1 === where ) {
                $scope.showOtherHDD = isNaN(tmp);
                if (!$scope.showOtherHDD)
                    $scope.NVRObj.HDDsize = tmp;
            }
        };


        // ----------  Bit Rate ---------- \\

        $scope.codecList = bitrateFactory.getCodecList();
        $scope.qList = bitrateFactory.getQList();
        $scope.RSList = bitrateFactory.getRsList();
        $scope.FPSList = bitrateFactory.getFPSList();
        $scope.getBitRate = function() {
            var bitRate = $scope.onNVR ?
                bitrateFactory.getBitrate(
                    $scope.RSList.indexOf( $scope.NVRObj.bitRateData.resolution ),
                    $scope.FPSList.indexOf( $scope.NVRObj.bitRateData.FPS )) :
                bitrateFactory.getBitrate(
                    $scope.RSList.indexOf( $scope.CMSObj.bitRateData.resolution ),
                    $scope.FPSList.indexOf( $scope.CMSObj.bitRateData.FPS ));
            return bitRate;
        };

        // ------------  CMS  ------------ \\

        $scope.isLocal = true;
        $scope.selectLocal = function(onLocal) {
            $scope.isLocal = onLocal;
        };






  }]);





angular.module('calculatorApp')
    .controller('ModalCtrl', ['$scope',  '$uibModal',function($scope,  $uibModal) {

$scope.items = ['item1', 'item2', 'item3'];

 $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'views/project.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
}
}]);

angular.module('calculatorApp')
    .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
