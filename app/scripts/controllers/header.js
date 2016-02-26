'use strict';


angular.module('calculatorApp').controller('HeaderCtrl',
    ['$scope', function ($scope) {

      $scope.activeArr        = [];
      $scope.activeArr.length = 3;

      $scope.activate = function( index ) {
          $scope.activeArr.fill(false);
          $scope.activeArr[index] = true;
      };

      $scope.activate(0);
}]);
