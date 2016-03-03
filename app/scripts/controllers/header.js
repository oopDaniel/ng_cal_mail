'use strict';


angular.module('MyApp').controller('HeaderCtrl', [
  '$scope',
  'alertService',
  '$interval',
  function ($scope, alertService,
        $interval) {

    window.alert('in headerCtrl!');
    // console.log('in headerCtrl!');

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

      var i = 0;
      var stopTime = $interval(function(){
          console.log(i+'s');
          window.alert(i+'s');
              i++;}, 1000);

}]);
