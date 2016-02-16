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
            {num:1,content:'1 day'},
            {num:2,content:'2 days'},
            {num:4,content:'4 days'},
            {num:7,content:'7 days (1 week)'},
            {num:14,content:'14 days (2 weeks)'},
            {num:30,content:'30 days (1 month)'},
            {num:60,content:'60 days (2 months)'},
            {num:90,content:'90 days (3 months)'},
            {num:-1,content:'Other duration'}
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

  });
