'use strict';


angular.module('MyApp').controller('HeaderCtrl', [
  '$scope',
  'alertService',
  '$interval',
  function ($scope, alertService,
        $interval) {

      $scope.alerts = alertService.getFlash();
      $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
      };


}]);
