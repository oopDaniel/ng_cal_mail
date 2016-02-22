'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calculatorApp
 */

var myApp = angular.module('calculatorApp');

myApp.controller('MainCtrl', [ '$scope', '$filter', 'optionsFactory', 'localStorageFactory',
        function ($scope, $filter, optionsFactory, localStorageFactory) {
        $scope.onNVR          = true;  // else on CMS
        $scope.totalModelSets = 1;
        $scope.NVRObj         = localStorageFactory.getDefaultNVRObj();
        $scope.CMSObj         = localStorageFactory.getDefaultCMSObj();
        var data              = $scope.onNVR ? $scope.NVRObj : $scope.CMSObj;
        $scope.data           = data;
        $scope.storageUnit    = $scope.NVRObj.display.storageUnit;
        $scope.bandwidthUnit  = $scope.NVRObj.display.bandwidthUnit;
        $scope.invalidForm    = true;

        var test = "HELLOWORLD";
         $scope.test = test;


    /*****************************************
     *     Track the current tab
     */
        $scope.whereami = function(onNVR) {
            $scope.onNVR  = onNVR;
            data          = $scope.onNVR ? $scope.NVRObj : $scope.CMSObj;
            $scope.data   = data;
        };
        $scope.whereami($scope.onNVR);

    /*****************************************
     *     Display the info of bandwidth and storage
     */
        $scope.getBandwidth = function() {
            var bandwidthDisplay;
                bandwidthDisplay = data.cameras * $scope.getBitRate();
            if ( !$scope.onNVR ) {
                bandwidthDisplay *= data.remoteUsers;
            }
            unitCheck('bandwidth', bandwidthDisplay);
            return bandwidthDisplay;
        };

        $scope.getStorage = function() {
            var storageDisplay = $scope.onNVR ?
              $scope.getBandwidth() * 0.125 * // to MB/s
              60 * 60 * 24 / 1024 * $scope.getEstDays() : 0;
            unitCheck('storage', storageDisplay);
            return storageDisplay;
        };

    /*****************************************
     *     Define the RAID rule and
     *     count the HDDs needed
     */
        $scope.getMinHDD = function() {
            var minHDD = optionsFactory.getMinHDD(
                        $scope.getStorage(),
                        data.HDDsize,
                        data.RAID );
            $scope.totalModelSets = minHDD[1];
            return minHDD[0];
        };

    /*****************************************
     *      Checking whether the 'selected' class
     *      should be applied in flexbox
     */
        $scope.RAIDArr = optionsFactory.getRAIDArr();

        $scope.HDDArr = optionsFactory.gethddSizeArr();
        $scope.hdd = optionsFactory.defaultHdd;

        $scope.showHdd = function() {
            var tmp = parseInt($scope.hdd);
            $scope.showOtherHDD = isNaN(tmp);
            if (!$scope.showOtherHDD)
                data.HDDsize = tmp;
        };

        $scope.coloringRAID = new Array( $scope.RAIDArr.length );
        // default RAID type
        $scope.coloringRAID[ optionsFactory.defaultRAIDindex ] = true;
        // after clicked on a certain type of RAID
        $scope.updateRAID = function(index, RAIDtype) {
            $scope.coloringRAID.fill(false);
            $scope.coloringRAID[index] = true;
            data.RAID = RAIDtype;
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
                    "" === data.HDDsize;
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



    /********************************************
     *              Notification
     */

    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };











  }]);



/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    Bit Rate Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Inherit {$scope.data} from parent controller

myApp.controller('bRateModalCtrl', ['$scope', '$uibModal',
            'optionsFactory', 'localStorageFactory', function($scope, $uibModal,
            optionsFactory, localStorageFactory) {

            $scope.bitRateColorFill    = false;
            $scope.bitRateColorFillCMS = false;

            $scope.codecList = optionsFactory.getCodecList();
            $scope.qList     = optionsFactory.getQList();
            $scope.RSList    = optionsFactory.getRsList();
            $scope.FPSList   = optionsFactory.getFPSList();

        /**
         *  Update the object data in "localStorageFactory"
         */
            $scope.update = function() {
                if ( $scope.$parent.onNVR )
                    localStorageFactory.setDefaultNVRObj($scope.data);
                else
                    localStorageFactory.setDefaultCMSObj($scope.data);
            };

        /**
         *  Counting the bit rate using the data in the object
         *
         *  @return (integer) bitRate
         */
            $scope.getBitRate = function() {
                var bitRate = optionsFactory.getBitRate(
                                $scope.data.bitRate.params.resolution ,
                                $scope.data.bitRate.params.FPS );
                $scope.data.bitRate.data = bitRate;
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

// Inherit {$scope.data} from parent controller

myApp.controller('estDayModalCtrl', ['$scope', '$uibModal',
        'optionsFactory', 'localStorageFactory', function($scope, $uibModal,
        optionsFactory, localStorageFactory) {

        $scope.estDayColorFill   = false;
        $scope.showOtherDuration = false;

        $scope.rDaysArr = optionsFactory.getRDaysArr();
        // Keep the data in the modal available for display
        $scope.rDays    = optionsFactory.defaultRDays;

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
                    "" === $scope.data.estDays.params.rDays;
            }
            if ( $scope.rDayForm.num_rhours.$dirty ) {
                $scope.invalidHours =
                    $scope.rDayForm.num_rhours.$error.pattern;
                $scope.emptyHours =
                    "" === $scope.data.estDays.params.rHours;
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
                optionsFactory.defaultRDays = $scope.rDays;
                // for storage
                $scope.data.estDays.params.rDays = tmp;
            }
            localStorageFactory.setDefaultNVRObj($scope.data);
        };

        $scope.getEstDays = function() {
            $scope.data.estDays.params.rHours =
                optionsFactory.hoursFix( $scope.data.estDays.params.rHours );
            $scope.data.estDays.data = optionsFactory.getEstDays(
                $scope.data.estDays.params.rDays,
                $scope.data.estDays.params.rHours,
                $scope.data.estDays.params.motion
                )
            return $scope.data.estDays.data;
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






/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                        Save Controller
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/



myApp.controller('saveModalCtrl', ['$scope', '$uibModal', 'localStorageFactory',
    function($scope, $uibModal, localStorageFactory) {

        $scope.pjArr = localStorageFactory.pj.projects;

        // Only contain '(Create New Project)'
        // $scope.isFirstTimeCreate  = $scope.pjArr.length === 0;
        $scope.isFirstTimeCreate  = !localStorageFactory.pj.hasData;
        $scope.isAddingNewPj      = false;

        $scope.emptyItemName      = true;
        $scope.emptyItemNameClass = false;
        $scope.emptyPjName        = true;
        $scope.emptyPjNameClass   = false;

        $scope.pj4form = {
            pjName:"",
            itemName:"",
            data:[]
        };

        // Set default value
        if ( !$scope.isFirstTimeCreate ) {
            $scope.pjNameOption = $scope.pjArr[0];
        }


    /**
     *  Input validation
     */
        $scope.validCheck = function() {
            $scope.emptyItemName =
                $scope.saveForm.itemName.$error.required;
            $scope.emptyItemNameClass =
                $scope.saveForm.itemName.$dirty &&
                $scope.emptyItemName;

            $scope.emptyPjName =
                "" === $scope.pj4form.pjName;
            $scope.emptyPjNameClass =
                $scope.saveForm.pjName.$dirty &&
                $scope.emptyPjName;

            $scope.$parent.invalidForm =
                $scope.emptyItemName ||
                $scope.emptyPjName && $scope.isAddingNewPj;
        };

    /**
     *  Update the object data in "localStorageFactory"
     */
        $scope.update = function() {
            $scope.isAddingNewPj = $scope.pjNameOption === null;
            $scope.validCheck();
        };


        $scope.submit = function () {
            // Refresh the result from the combo box
            if ( !$scope.isAddingNewPj && !$scope.isFirstTimeCreate ) {
                $scope.pj4form.pjName = $scope.pjNameOption.name;
            }

            if ( $scope.onNVR ) {
                $scope.data = refreshDisplay($scope.data);
                localStorageFactory.pj.addItem( $scope.pj4form.itemName,
                            $scope.pj4form.pjName, $scope.data, true );
            } else {
                $scope.data = refreshDisplay($scope.data);
                localStorageFactory.pj.addItem( $scope.pj4form.itemName,
                            $scope.pj4form.pjName, $scope.data, false );
            }
            $scope.alerts.push({ type: 'success', msg: 'Successfully saved!' });
            $scope.closeModal();
        };

        var refreshDisplay = function(obj) {
            obj.display.storage       = $scope.getStorage();
            obj.display.bandwidth     = $scope.getBandwidth();
            return obj;
        };

        $scope.openModal = function (size) {

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/save.html',
                size: size,
                scope: $scope
            });
        };

        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };
}]);
