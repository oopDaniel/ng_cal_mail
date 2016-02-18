'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the calculatorApp
 */
angular.module('calculatorApp')
  .controller('ProjectCtrl', ['$scope', '$filter', 'localStorageFactory',
    function ($scope, $filter, localStorageFactory) {
        $scope.filtText = '';
        $scope.projects = localStorageFactory.getPjArr();

        // Remove the option of 'create' from pj array
        if ( $scope.projects[ $scope.projects.length - 1 ].name ===
            localStorageFactory.defaultNewPjStr ) {
            $scope.projects.pop();
        }

        $scope.totalStorage = function (pj) {
            var storage = 0;
            for ( var i in pj.NVR ) {
                storage += parseFloat(pj.NVR[i].data.display.storage);
            }

            // Not available for CMS

        /*  for ( var i in pj.CMS ) {
                storage += parseFloat(pj.CMS[i].data.display.storage);
            }
        */
            counter = 0;
            storage = unitConverter(storage);
            return $filter("number")(storage, 1) + " " + storageUnitArr[counter];
        };

        $scope.totalBandwidth = function (pj) {
            var bandwidth = 0;
            for ( var i in pj.NVR ) {
                bandwidth += parseFloat(pj.NVR[i].data.display.bandwidth);
            }
            for ( var i in pj.CMS ) {
                bandwidth += parseFloat(pj.CMS[i].data.display.bandwidth);
            }
            counter = 0;
            bandwidth = unitConverter(bandwidth);
            return $filter("number")(bandwidth, 1) + " " + bandwidthUnitArr[counter];
        };

        var counter;
        var storageUnitArr   = ["GB","TB","PB"];
        var bandwidthUnitArr = ["Mbps","Gbps","Tbps"];

        var unitConverter = function (num) {
            if ( num > 10240 ) {
                counter++;
                return unitConverter( num / 1024 );
            }
            return num;
        };
  }]);
