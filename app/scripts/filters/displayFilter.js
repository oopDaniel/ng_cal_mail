'use strict';

/**
 * @ngdoc filter
 * @name calculatorApp.filter:displayFilter
 * @function
 * @description
 * # displayFilter
 * Filter in the calculatorApp.
 */
angular.module('calculatorApp')
    .filter('displayFilter', ['$filter', function ($filter) {
        return function (input) {
            if ( 0 === input ) {
                return '- ';
            } else if ( input > 1024 * 1024 * 10 ) {
                return $filter('number')(input / 1024 / 1024, 1);
            } else if ( input > 10240 ) {
                return $filter('number')(input / 1024, 1);
            } else if ( input === (input|0) ) {
                return $filter('number')(input);
            } else {
                // Remove the last digit if it's zero
                var tmpNum = $filter('number')(input, 1);
                var tmpStr = tmpNum.toString();
                var s = tmpStr.slice( tmpStr.length - 1, tmpStr.length);
                return s === '0' ? $filter('number')(input, 1) : tmpNum;
            }
        };
  }]);