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
        $scope.NVRObj = demoObjectFactory.getNVRObj();
        $scope.CMSObj = demoObjectFactory.getCMSObj();

        // for switch tab
        $scope.whereami = function(toNVR) {
            $scope.onNVR = toNVR;
        };


        $scope.getBandwidth = function() {
            if ( $scope.onNVR ) {
                $scope.bandwidthDisplay = $scope.NVRObj.cameras * $scope.getBitRate();
            } else {
                $scope.bandwidthDisplay = $scope.CMSObj.cameras * $scope.getBitRate() * $scope.CMSObj.remoteUsers;
            }
            unitCheck('bandwidthUnit');
            return $scope.bandwidthDisplay;
        };


        $scope.getStorage = function() {
            $scope.storageDisplay = $scope.onNVR ?
              $scope.bandwidthDisplay * 0.125 * // to MB/s
              60 * 60 * 24 / 1024 * $scope.getEstDays() : 0;
            unitCheck('storageUnit');
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

        var unitCheck = function(index) {
            if ( 'storageUnit' === index )
                $scope.storageUnit =
                    unitConverter($scope.storageDisplay, true) + 'B';
            if ( 'bandwidthUnit' === index )
                $scope.bandwidthUnit =
                    unitConverter($scope.bandwidthDisplay, false) + 'bps';
        };

        var unitConverter = function( num, onStorage ) {
            if ( num > 1024 * 1024 * 10 )
                 return onStorage ? 'P' : 'T';
            else if ( num > 10240 )
                 return onStorage ? 'T' : 'G';
            else return onStorage ? 'G' : 'M';
        };


        // --------- Input validation --------- \\

        $scope.hddEmpty         = false;
        $scope.hddInvalid       = false;
        $scope.cameraEmpty      = false;
        $scope.cameraInvalid    = false;
        $scope.cameraEmptyCMS   = false;
        $scope.cameraInvalidCMS = false;

        $scope.ValidCheck = function() {
            if ( $scope.NVRForm.HDDsize.$dirty ) {
                $scope.hddEmpty =
                    '' === $scope.NVRObj.HDDsize;
                $scope.hddInvalid =
                    $scope.NVRForm.HDDsize.$error.pattern;
            }
            if ( $scope.NVRForm.num_cameras.$dirty ) {
                $scope.cameraEmpty =
                    $scope.NVRForm.num_cameras.$error.required;
                $scope.cameraInvalid =
                    $scope.NVRForm.num_cameras.$error.pattern;
            }
            if ( $scope.CMSForm.num_cameras_cms.$dirty ) {
                $scope.cameraEmptyCMS =
                    $scope.CMSForm.num_cameras_cms.$error.required;
                $scope.cameraInvalidCMS =
                    $scope.CMSForm.num_cameras_cms.$error.pattern;
            }
        };


        // -------------  HDD ------------- \\


        $scope.HDDArr = menuFactory.gethddSizeArr();
        $scope.hdd = $scope.HDDArr[2];

        $scope.showHdd = function() {
            var tmp = parseInt($scope.hdd);
            $scope.showOtherHDD = isNaN(tmp);
            if (!$scope.showOtherHDD)
                $scope.NVRObj.HDDsize = tmp;
        };

        // ----------  Bit Rate ---------- \\

        $scope.bRate = 0;
        $scope.getBitRate = function() {
            $scope.$broadcast('parentGetBitRate');
            return  $scope.bRate;
        };

        $scope.$on('childSendBitRate', function(e, data) {
            $scope.bRate = data;
        });


        // ------------  estDay  ------------ \\

        $scope.estDays = 0;
        $scope.getEstDays = function() {
            $scope.$broadcast('parentGetEstDays');
            return  $scope.estDays;
        };

        $scope.$on('childSendEstDays', function(e, data) {
            $scope.estDays = data;
        });


        // ------------  CMS  ------------ \\

        $scope.isLocal = true;
        $scope.selectLocal = function(onLocal) {
            $scope.isLocal = onLocal;
        };



  }]);


// ------------------------------
// ------------------------------


angular.module('calculatorApp')
    .controller('bRateModalCtrl', ['$scope', '$uibModal',
        'bitrateFactory', 'demoObjectFactory', function($scope, $uibModal,
        bitrateFactory, demoObjectFactory) {

    $scope.bitRateColorFill    = false;
    $scope.bitRateColorFillCMS = false;

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
    };


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
        var onNVR = $scope.$parent.onNVR;

        $scope.bitRateColorFill    = true;
        $scope.bitRateColorFillCMS = true;

        var templateStr = onNVR ?
            'views/bitRateEstimate.html' :
            'views/bitRateEstimateCMS.html';

        var modalInstance = $uibModal.open({
            templateUrl: templateStr,
            size       : size,
            scope      : $scope
        });

        // Remove the filled color
        modalInstance.result.then( null, function () {
            $scope.bitRateColorFill    = false;
            $scope.bitRateColorFillCMS = false;

        });
    };
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

    $scope.rDaysArr = menuFactory.getRDaysArr();
    // Get the data from service for keeping display available
    $scope.rDays    = menuFactory.getRDayKeeper();

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

    /**
     *  Update the object data in "demoObjectFactory"
     */
    $scope.update = function() {
        var tmp = parseInt($scope.rDays);
        // The last option begins with 'Other', thus NaN
        $scope.showOtherDuration = isNaN(tmp);

        // Do the update if getting a number
        if (!$scope.showOtherDuration) {
            // for cross-controller display
            menuFactory.setRDayKeeper($scope.rDays);
            // for storage
            $scope.NVRObj.rDays = tmp;
        }
        demoObjectFactory.setNVRObj($scope.NVRObj);
    };

    $scope.getEstDays = function() {
        $scope.NVRObj.rHours =
            $scope.NVRObj.rHours > 24 ?
                24 : $scope.NVRObj.rHours;
        $scope.estDays = $scope.NVRObj.rDays *
            $scope.NVRObj.motion / 100 *
            $scope.NVRObj.rHours / 24;
        return Math.ceil($scope.estDays);
    };

    /**
     *  In response to parent's "getEstDays" demand
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
    };
}]);
