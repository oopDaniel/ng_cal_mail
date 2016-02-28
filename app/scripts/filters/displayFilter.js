'use strict';

/**
 * @ngdoc filter
 * @name calculatorApp.filter:displayFilter
 * @description
 *   Filter the zero in display
 */

angular.module('calculatorApp')
    .filter('displayFilter', ['$filter', function ($filter) {
        return function (input) {
            var num    = parseFloat(input);
            var numStr = num.toString();

            if ( num > 0 ) {
                var digit  = numStr.slice( numStr.length - 1, numStr.length );
                return digit === '0' ?
                    num :
                    $filter('number')(num, 1);
            } else {
                return '- ';
            }
        };
  }]);
