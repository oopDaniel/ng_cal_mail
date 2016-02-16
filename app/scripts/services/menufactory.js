'use strict';

/**
 * @ngdoc service
 * @name calculatorApp.menuFactory
 * @description
 * # menuFactory
 * Service in the calculatorApp.
 */
angular.module('calculatorApp')
    .service('menuFactory', function () {
        var rDaysArr = [
            '1 day',
            '2 days',
            '4 days',
            '7 days (1 week)',
            '14 days (2 weeks)',
            '30 days (1 month)',
            '60 days (2 months)',
            '90 days (3 months)',
            'Other duration'
        ];

        var hddSizeArr = [
          '1TB', '2TB', '3TB',
          '4TB', '6TB', 'Other'
        ];

        this.getRDaysArr = function () {
            return rDaysArr;
        };

        this.gethddSizeArr = function () {
            return hddSizeArr;
        };

        var rDayKeeper = rDaysArr[5];
        this.getRDayKeeper = function () {
            return rDayKeeper;
        }

        this.setRDayKeeper = function (rday) {
            rDayKeeper = rday;
        }

  });
