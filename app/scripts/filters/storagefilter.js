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
  .filter('storageFilter', function () {
    return function (input) {
      return 'storageFilter filter: ' + input;
    };
  });
