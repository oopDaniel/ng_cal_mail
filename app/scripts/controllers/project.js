'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the calculatorApp
 */
angular.module('calculatorApp')
  .controller('ProjectCtrl', ['$scope', 'projectFactory',
    function ($scope, projectFactory) {
        $scope.filtText = '';
        $scope.projects = projectFactory.getProjects();
  }]);
