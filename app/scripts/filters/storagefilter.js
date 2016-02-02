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
            else
                return input > 10240 ?
                    $filter('number')(input / 1024, 1) :
                    $filter('number')(input);
        };
  }]);
