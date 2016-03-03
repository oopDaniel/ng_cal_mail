'use strict';

/**
 * @ngdoc function
 * @name calculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the calculatorApp
 */


var myApp = angular.module('MyApp');

myApp.controller('MainCtrl', [
    '$scope',
    '$filter',
    'alertService',
    'hasOffset',
    function (
        $scope,
        $filter,
        alertService,
        hasOffset ) {

        var data              = hasOffset ?
            {mynum1:'100', mynum2:'50', offset: '1'} :
            {mynum1:'100', mynum2:'50'} ;
        $scope.data           = data;
        $scope.dataURL        = 'views/dataForm.html';
        $scope.hasOffset        = hasOffset;





        $scope.showSub = function () {
            var offset = parseFloat(data.offset) || 0;
            return hasOffset ?
                parseFloat(data.mynum1) - parseFloat(data.mynum2) - offset :
                parseFloat(data.mynum1) / parseFloat(data.mynum2);
        };

        $scope.showAdd = function () {
            var offset = parseFloat(data.offset) || 0;
            return hasOffset ?
                parseFloat(data.mynum1) + parseFloat(data.mynum2) - offset :
                parseFloat(data.mynum1) * parseFloat(data.mynum2);
        };


  }]);







// *******************************************************************


myApp.controller('formCtrl', ['$scope',
    function($scope) {

        $scope.emptyN1    = false;
        $scope.emptyN2    = false;
        $scope.badN1      = false;
        $scope.badN2      = false;
        $scope.emptyD1    = false;
        $scope.badD1      = false;
        $scope.formHolder = {};

        $scope.ValidCheck = function() {
            if ( $scope.formHolder.myForm.mynum1 !== undefined &&
                 $scope.formHolder.myForm.mynum1.$dirty ) {
                $scope.emptyN1 =
                    $scope.formHolder.myForm.mynum1.$error.required;
                $scope.badN1 =
                    $scope.formHolder.myForm.mynum1.$error.pattern;
            }

            if ( $scope.formHolder.myForm.mynum2 !== undefined &&
                 $scope.formHolder.myForm.mynum2.$dirty ) {
                $scope.emptyN2 =
                    $scope.formHolder.myForm.mynum2.$error.required;
                $scope.badN2 =
                    $scope.formHolder.myForm.mynum2.$error.pattern;
            }

        };

}]);


//*************************************************


myApp.controller('saveCtrl', [
    '$scope',
    '$uibModal',
    'storageFactory',
    'alertService',
    function(
        $scope,
        $uibModal,
        storageFactory,
        alertService) {


        $scope.pjArr       = storageFactory.pj.projects;
        $scope.emptyName   = false;
        $scope.pjname      = '';
        var data           = $scope.data;


    /**
     *  Input validation
     */
        $scope.validCheck = function() {
            $scope.emptyName =
                $scope.saveForm.pjName.$dirty &&
                '' === $scope.pjName;
        };



        $scope.submit = function () {
            // Refresh the result from the combo box

            data.sum   = $scope.showAdd();
            data.diff  = $scope.showSub();

            if (storageFactory.pj.addItem(
                $scope.pjname, data, $scope.hasOffset ) ) {
                    alertService.flash({ type: 'success', msg: 'Successfully saved!' });
            } else {
                    alertService.flash({ type: 'danger', msg: 'Failed!' });
            }
            $scope.closeModal();
        };

        $scope.openModal = function (size) {

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/save.html',
                size: size,
                // controller: saveCtrl,
                scope: $scope
            });
        };

        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };
}]);
