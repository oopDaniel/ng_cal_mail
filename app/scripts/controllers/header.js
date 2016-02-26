'use strict';


angular.module('calculatorApp').controller('HeaderCtrl',
    ['$scope', '$state', '$stateParams',
    function ($scope, $state, $stateParams) {


      $scope.activeArr        = [];
      $scope.activeArr.length = 3;

      $scope.activate = function( index ) {
          $scope.activeArr.fill(false);
          $scope.activeArr[index] = true;
      };

      $scope.activate(0);
}]);
