'use strict';

/**
 * @ngdoc filter
 * @name calculatorApp.filter:storageFilter
 * @function
 * @description
 * # storageFilter
 * Filter in the calculatorApp.
 */
angular.module('calculatorApp')
    .filter('storageFilter', ['$filter', function ($filter) {
        return function (input) {
            if ( 0 === input )
                return '- ';
            else if ( input > 1024 * 1024 * 10 )
                return $filter('number')(input / 1024 / 1024, 1);
            else if ( input > 10240 )
                return $filter('number')(input / 1024, 1);
            else
                return input === (input|0) ? // filter the decimal numbers
                    $filter('number')(input) :
                    $filter('number')(input, 1);
        };
  }]);
