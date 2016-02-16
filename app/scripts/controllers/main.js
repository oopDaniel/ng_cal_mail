'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calculatorApp
 */
angular.module('calculatorApp')
    .controller('MainCtrl', [ '$scope', 'menuFactory', 'demoObjectFactory',
        function ($scope, menuFactory, demoObjectFactory) {
        $scope.onNVR = true;  // else on CMS
        $scope.storageDisplay = 0;
        $scope.bandwidthDisplay = 0;
        $scope.storageUnit = 'GB';
        $scope.bandwidthUnit = 'Mbps';
        $scope.modelSets = 1;
        $scope.estDays = 4;
        $scope.NVRObj=demoObjectFactory.getNVRObj();
        $scope.CMSObj=demoObjectFactory.getCMSObj();

        // for switch tab
        $scope.whereami = function(toNVR) {
            $scope.onNVR = toNVR;
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


                    break;
                default:
            }
        };



        // --------------- for validation ---------------

        // $scope.rdaysEmpty  = false;
        // $scope.rhoursEmpty = false;
        // $scope.hddEmpty    = false;
        // $scope.required = function() {
        //     $scope.rdaysEmpty  = $scope.showOtherDuration && '' === $scope.NVRObj.rDays;
        //     $scope.hddEmpty    = $scope.showOtherHDD && '' === $scope.NVRObj.HDDsize;
        //     $scope.rhoursEmpty = '' === $scope.NVRObj.rHours;
        // };



        // -------------------------------- \\
        // ------------  Panel ------------ \\
        // -------------------------------- \\

        // --------------- for validation ---------------


        // used to check if they've been clicked,
        // if true, fill with purple or green
        // $scope.onEstDays    = false;
        // $scope.onBitRate    = false;
        // $scope.onCMSBitRate = false;
        // $scope.rDaysArr = menuFactory.getRDaysArr();
        // set the default value for the combo box
        // $scope.rDays = $scope.rDaysArr[5];
        // display the textarea for other duration
        // $scope.showOtherDuration = false;

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


        $scope.bRate = 0;
        $scope.getBitRate = function() {
            $scope.$broadcast('parentGetBitRate');
            return  $scope.bRate;
        }

        $scope.$on('childSendBitRate', function(e, data) {
            $scope.bRate = data;
        });

        // $scope.getBRate = function() {
        //     $scope.$broadcast('parentGetBitRate');
        //     return  $scope.bRate;
        // }

//-------------------------------------------------------------
//-------------------------------------------------------------
        $scope.estDay = 0;
        $scope.getEstDays = function() {
            $scope.$broadcast('parentGetEstDays');
            return  $scope.estDay;
        };

        $scope.$on('childSendEstDays', function(e, data) {
            $scope.estDay = data;
        });
//-------------------------------------------------------------
//-------------------------------------------------------------


        // ------------  CMS  ------------ \\

        $scope.isLocal = true;
        $scope.selectLocal = function(onLocal) {
            $scope.isLocal = onLocal;
        };



  }]);


// ------------------------------
// ------------------------------


// angular.module('calculatorApp')
//     .controller('ModalCtrl', ['$scope',  '$uibModal',function($scope,  $uibModal) {

// $scope.items = ['item1', 'item2', 'item3'];

//  $scope.open = function (size) {

//     var modalInstance = $uibModal.open({
//       animation: true,
//       templateUrl: 'views/project.html',
//       controller: 'ModalInstanceCtrl',
//       size: size,
//       resolve: {
//         items: function () {
//           return $scope.items;
//         }
//       }
//     });
// }
// }]);

// // ------------------------------
// // ------------------------------


// angular.module('calculatorApp')
//     .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

//   $scope.items = items;
//   $scope.selected = {
//     item: $scope.items[0]
//   };

//   $scope.ok = function () {
//     $uibModalInstance.close($scope.selected.item);
//   };

//   $scope.cancel = function () {
//     $uibModalInstance.dismiss('cancel');
//   };
// });



// ------------------------------
// ------------------------------


angular.module('calculatorApp')
    .controller('bRateModalCtrl', ['$scope', '$uibModal',
        'bitrateFactory', 'demoObjectFactory', function($scope, $uibModal,
        bitrateFactory, demoObjectFactory) {

    $scope.bitRateColorFill    = false;
    $scope.bitRateColorFillCMS = false;

    $scope.NVRObj = demoObjectFactory.getNVRObj();
    $scope.CMSObj = demoObjectFactory.getCMSObj();

    $scope.codecList = bitrateFactory.getCodecList();
    $scope.qList     = bitrateFactory.getQList();
    $scope.RSList    = bitrateFactory.getRsList();
    $scope.FPSList   = bitrateFactory.getFPSList();

    /**
     *  Update the object data in "demoObjectFactory"
     */
    $scope.update = function() {
        if ( $scope.$parent.onNVR )
            demoObjectFactory.setNVRObj($scope.NVRObj);
        else
            demoObjectFactory.setCMSObj($scope.CMSObj);
    }


    $scope.getBitRate = function() {
        var bitRate;
        if ( $scope.$parent.onNVR ) {
            bitRate = bitrateFactory.getBitrate(
                $scope.RSList.indexOf( $scope.NVRObj.bitRateData.resolution ),
                $scope.FPSList.indexOf( $scope.NVRObj.bitRateData.FPS ));
            $scope.NVRObj.bitRate = bitRate;
        } else {
            bitRate = bitrateFactory.getBitrate(
                $scope.RSList.indexOf( $scope.CMSObj.bitRateData.resolution ),
                $scope.FPSList.indexOf( $scope.CMSObj.bitRateData.FPS ));
            $scope.CMSObj.bitRate = bitRate;
            console.log("CMS Bit Rate: "+bitRate);
        }
        return bitRate;
    };

    /**
     *  In response to parent's "getBitRate()" demand
     */
    $scope.$on('parentGetBitRate', function(e) {
        $scope.$emit('childSendBitRate', $scope.getBitRate());
    });

    /**
     *  Modal handler
     */
    $scope.open = function (size) {
        // $scope.$parent.onNVR = onNVR;
        // console.log("On NVR: "+onNVR);
        var onNVR = $scope.$parent.onNVR;

        $scope.bitRateColorFill    = true;
        $scope.bitRateColorFillCMS = true;

        var templateStr = onNVR ?
            'views/bitRateEstimate.html' :
            'views/bitRateEstimateCMS.html';

        var modalInstance = $uibModal.open({
            templateUrl: templateStr,
            size: size,
            scope: $scope
        });

        // Remove the filled color
        modalInstance.result.then( null, function () {
            $scope.bitRateColorFill    = false;
            $scope.bitRateColorFillCMS = false;

        });
    }
}]);

















//--------------------------------
//--------------------------------
//--------------------------------












angular.module('calculatorApp')
    .controller('estDayModalCtrl', ['$scope', '$uibModal',
        'menuFactory', 'demoObjectFactory', function($scope, $uibModal,
        menuFactory, demoObjectFactory) {


    $scope.estDayColorFill   = false;
    $scope.showOtherDuration = false;

    $scope.NVRObj = demoObjectFactory.getNVRObj();

    $scope.rDaysArr = menuFactory.getRDaysArr();
    // set the default value for the combo box
    $scope.rDays = $scope.rDaysArr[5];


    $scope.invalidHours = false;
    $scope.invalidDays  = false;
    $scope.emptyDays    = false;
    $scope.emptyHours   = false;

    $scope.validCheck = function() {
        if ( $scope.rDayForm.$dirty ) {
            $scope.invalidDays =
                $scope.rDayForm.myrdays.$error.pattern;
            $scope.emptyDays =
                '' === $scope.NVRObj.rDays;
        }

        if ( $scope.rDayForm.num_rhours.$dirty ) {
            $scope.invalidHours =
                $scope.rDayForm.num_rhours.$error.pattern;
            $scope.emptyHours =
                '' === $scope.NVRObj.rHours;
        }
    };





    $scope.update = function() {
        var tmp = parseInt($scope.rDays.content);

        $scope.showOtherDuration = isNaN(tmp);
        if (!$scope.showOtherDuration) {
            var tmpstr = '' + tmp;
            $scope.NVRObj.rDays = $scope.rDaysArr[tmpstr].num;
            console.log($scope.rDaysArr[tmpstr] );
        }

        demoObjectFactory.setNVRObj($scope.NVRObj);
    };

    /**
     *  Update the object data in "demoObjectFactory"
     */
    // $scope.update = function() {


    //     if ($scope.rDayForm.myrdays.$dirty)
    //         console.log("yo");


    //     if ( $scope.$parent.onNVR )
    //         demoObjectFactory.setNVRObj($scope.NVRObj);
    //     else
    //         demoObjectFactory.setCMSObj($scope.CMSObj);
    // }


    $scope.getEstDays = function() {
        $scope.NVRObj.rHours = $scope.NVRObj.rHours > 24 ?
                               24 : $scope.NVRObj.rHours;
        $scope.estDays = $scope.NVRObj.rDays *
          $scope.NVRObj.motion / 100 *
          $scope.NVRObj.rHours / 24;
        return Math.ceil($scope.estDays);
    };

    /**
     *  In response to parent's "getBitRate()" demand
     */
    $scope.$on('parentGetEstDays', function(e) {
        $scope.$emit('childSendEstDays', $scope.getEstDays());
    });

    /**
     *  Modal handler
     */
    $scope.open = function (size) {

        $scope.estDayColorFill = true;

        var modalInstance = $uibModal.open({
            templateUrl: 'views/rDaysEstimate.html',
            size: size,
            scope: $scope
        });

        // Remove the filled color
        modalInstance.result.then( null, function () {
            $scope.estDayColorFill = false;
        });
    }
}]);
