'use strict';


angular.module('calculatorApp').controller('HeaderCtrl',
    ['$scope', 'alertService', function ($scope, alertService) {

      $scope.activeArr        = [];
      $scope.activeArr.length = 3;

      $scope.activate = function(index) {
          $scope.activeArr.fill(false);
          $scope.activeArr[index] = true;
      };

      $scope.activate(0);


      $scope.alerts = alertService.getFlash();
      $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
      };
}]);
