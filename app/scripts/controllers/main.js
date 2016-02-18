'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calculatorApp
 */
angular.module('calculatorApp')
    .controller('MainCtrl', [ '$scope', '$filter', 'formOptionsFactory', 'localStorageFactory',
        function ($scope, $filter, formOptionsFactory, localStorageFactory) {
        $scope.onNVR          = true;  // else on CMS
        $scope.totalModelSets = 1;
        $scope.NVRObj         = localStorageFactory.getDefaultNVRObj();
        $scope.CMSObj         = localStorageFactory.getDefaultCMSObj();
        $scope.storageUnit    = $scope.NVRObj.storageUnit;
        $scope.bandwidthUnit  = $scope.NVRObj.bandwidthUnit;

    /*****************************************
     *     Track the current tab
     */
        $scope.whereami = function(onNVR) {
            $scope.onNVR = onNVR;
        };

    /*****************************************
     *     Local storage
     */
        $scope.save = function() {
            if ($scope.onNVR) {
                $scope.NVRObj.storageUnit   = $scope.storageUnit;
                $scope.NVRObj.bandwidthUnit = $scope.bandwidthUnit;
                $scope.NVRObj.storage       = $scope.getStorage();
                $scope.NVRObj.bandwidth     = $scope.getBandwidth();
                localStorageFactory.storeObj('NVR');
            } else {
                $scope.CMSObj.storageUnit   = $scope.storageUnit;
                $scope.CMSObj.bandwidthUnit = $scope.bandwidthUnit;
                $scope.CMSObj.storage       = $scope.getStorage();
                $scope.CMSObj.bandwidth     = $scope.getBandwidth();
                localStorageFactory.storeObj('CMS');
            }
            console.log("file saved!");
        };

        $scope.load = function() {
            var x = localStorageFactory.getStoredObj('NVR');
            console.log(x);
        };

    /*****************************************
     *     Display the info of bandwidth and storage
     */
        $scope.getBandwidth = function() {
            var bandwidthDisplay;
            if ( $scope.onNVR ) {
                bandwidthDisplay = $scope.NVRObj.cameras * $scope.getBitRate();
            } else {
                bandwidthDisplay = $scope.CMSObj.cameras * $scope.getBitRate() * $scope.CMSObj.remoteUsers;
            }
            unitCheck('bandwidth', bandwidthDisplay);
            return $filter('displayFilter')(bandwidthDisplay);
        };

        $scope.getStorage = function() {
            var storageDisplay = $scope.onNVR ?
              $scope.getBandwidth() * 0.125 * // to MB/s
              60 * 60 * 24 / 1024 * $scope.getEstDays() : 0;
            unitCheck('storage', storageDisplay);
            return $filter('displayFilter')(storageDisplay);
        };

    /*****************************************
     *     Define the RAID rule and
     *     count the HDDs needed
     */
        $scope.getMinHDD = function() {
            var minHDD = Math.ceil( $scope.getStorage() / $scope.NVRObj.HDDsize / 1024 );
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
            $scope.totalModelSets = Math.ceil( minHDD / 8 );
            return minHDD > 8 ? 8 : minHDD;
        };

    /*****************************************
     *      Checking whether the 'selected' class
     *      should be applied in flexbox
     */
        $scope.RAIDArr = formOptionsFactory.getRAIDArr();

        $scope.showHdd = function() {
            var tmp = parseInt($scope.hdd);
            $scope.showOtherHDD = isNaN(tmp);
            if (!$scope.showOtherHDD)
                $scope.NVRObj.HDDsize = tmp;
        };

        $scope.coloringRAID = new Array( $scope.RAIDArr.length );
        // default RAID type
        $scope.coloringRAID[ formOptionsFactory.defaultRAIDindex ] = true;
        // after clicked on a certain type of RAID
        $scope.updateRAID = function(index, RAIDtype) {
            $scope.coloringRAID.fill(false);
            $scope.coloringRAID[index] = true;
            $scope.NVRObj.RAID = RAIDtype;
        };

    /*****************************************
     *      Convert the units displayed
     */
        var unitCheck = function(index, capacity) {
            if ( 'storage' === index )
                $scope.storageUnit =
                    unitConverter(capacity, true) + 'B';
            if ( 'bandwidth' === index )
                $scope.bandwidthUnit =
                    unitConverter(capacity, false) + 'bps';
        };

        var unitConverter = function( num, onStorage ) {
            if ( num > 1024 * 1024 * 10 )
                 return onStorage ? 'P' : 'T';
            else if ( num > 10240 )
                 return onStorage ? 'T' : 'G';
            else return onStorage ? 'G' : 'M';
        };


    /***************************************
     *      Input validation
     */
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

    /********************************************
     *      Deal with the selection of HDD,
     *      check if 'other option' was selected.
     */
        $scope.HDDArr = formOptionsFactory.gethddSizeArr();
        $scope.hdd = formOptionsFactory.defaultHdd;

        $scope.showHdd = function() {
            var tmp = parseInt($scope.hdd);
            $scope.showOtherHDD = isNaN(tmp);
            if (!$scope.showOtherHDD)
                $scope.NVRObj.HDDsize = tmp;
        };

    /********************************************
     *      Communication with the Bit Rate modal
     */
        $scope.bRate = 0;
        $scope.getBitRate = function() {
            $scope.$broadcast('parentGetBitRate');
            return  $scope.bRate;
        };

        $scope.$on('childSendBitRate', function(e, data) {
            $scope.bRate = data;
        });


    /***************************************************
     *      Communication with the estimated-days modal
     */
        $scope.estDays = 0;
        $scope.getEstDays = function() {
            $scope.$broadcast('parentGetEstDays');
            return  $scope.estDays;
        };

        $scope.$on('childSendEstDays', function(e, data) {
            $scope.estDays = data;
        });


    /********************************************
     *      CMS local user identifier
     */
        $scope.isLocal = true;
        $scope.selectLocal = function(onLocal) {
            $scope.isLocal = onLocal;
        };

  }]);



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Bit Rate Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


    angular.module('calculatorApp')
        .controller('bRateModalCtrl', ['$scope', '$uibModal',
            'bitrateFactory', 'localStorageFactory', function($scope, $uibModal,
            bitrateFactory, localStorageFactory) {

            $scope.bitRateColorFill    = false;
            $scope.bitRateColorFillCMS = false;

            $scope.codecList = bitrateFactory.getCodecList();
            $scope.qList     = bitrateFactory.getQList();
            $scope.RSList    = bitrateFactory.getRsList();
            $scope.FPSList   = bitrateFactory.getFPSList();

        /**
         *  Update the object data in "localStorageFactory"
         */
            $scope.update = function() {
                if ( $scope.$parent.onNVR )
                    localStorageFactory.setDefaultNVRObj($scope.NVRObj);
                else
                    localStorageFactory.setDefaultCMSObj($scope.CMSObj);
            };

        /**
         *  Counting the bit rate using the data in the object
         *
         *  @return (integer) bitRate
         */
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
         *  In response to parent's demand of "getBitRate()",
         *  return the result of bit rate counted.
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



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Estimated-days Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/



angular.module('calculatorApp')
    .controller('estDayModalCtrl', ['$scope', '$uibModal',
        'formOptionsFactory', 'localStorageFactory', function($scope, $uibModal,
        formOptionsFactory, localStorageFactory) {

        $scope.estDayColorFill   = false;
        $scope.showOtherDuration = false;

        $scope.rDaysArr = formOptionsFactory.getRDaysArr();
        // Keep the data in the modal available for display
        $scope.rDays    = formOptionsFactory.defaultRDays;

        $scope.invalidHours = false;
        $scope.invalidDays  = false;
        $scope.emptyDays    = false;
        $scope.emptyHours   = false;

    /**
     *  Input validation
     */
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
     *  Update the object data in "localStorageFactory"
     */
        $scope.update = function() {
            var tmp = parseInt($scope.rDays);
            // The last option begins with 'Other', thus NaN
            $scope.showOtherDuration = isNaN(tmp);

            // Do the update if getting a number
            if (!$scope.showOtherDuration) {
                // for cross-controller display
                formOptionsFactory.defaultRDays = $scope.rDays;
                // for storage
                $scope.NVRObj.rDays = tmp;
            }
            localStorageFactory.setDefaultNVRObj($scope.NVRObj);
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
