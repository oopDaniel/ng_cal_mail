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
    'isData1',
    function (
        $scope,
        $filter,
        alertService,
        isData1 ) {

        var data              = isData1 ?
            {mynumber1:'100', mynumber2:'50', data1: '1'} :
            {mynumber1:'100', mynumber2:'50'} ;
        $scope.data           = data;
        $scope.dataURL        = 'views/dataForm.html';
        $scope.isData1        = isData1;





        $scope.showSub = function () {
            return isData1 ?
                parseFloat(data.mynumber1) - parseFloat(data.mynumber2) - parseFloat(data.data1) :
                parseFloat(data.mynumber1) / parseFloat(data.mynumber2);
        };

        $scope.showAdd = function () {
            return isData1 ?
                parseFloat(data.mynumber1) + parseFloat(data.mynumber2) - parseFloat(data.data1):
                parseFloat(data.mynumber1) * parseFloat(data.mynumber2);
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
            if ( $scope.formHolder.myForm.mynumber1 !== undefined &&
                 $scope.formHolder.myForm.mynumber1.$dirty ) {
                $scope.emptyN1 =
                    $scope.formHolder.myForm.mynumber1.$error.required;
                $scope.badN1 =
                    $scope.formHolder.myForm.mynumber1.$error.pattern;
            }

            if ( $scope.formHolder.myForm.mynumber2 !== undefined &&
                 $scope.formHolder.myForm.mynumber2.$dirty ) {
                $scope.emptyN2 =
                    $scope.formHolder.myForm.mynumber2.$error.required;
                $scope.badN2 =
                    $scope.formHolder.myForm.mynumber2.$error.pattern;
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


        $scope.pjArr              = storageFactory.pj.projects;

        $scope.isFirstTimeCreate  = !storageFactory.pj.hasData;
        $scope.isAddingNewPj      = false;

        $scope.emptyItemName      = true;
        $scope.emptyItemNameClass = false;
        $scope.emptyPjName        = true;
        $scope.emptyPjNameClass   = false;

        $scope.overwriteAlert     = [];
        $scope.saveAgain          = false;

        $scope.pj4form = {
            pjName:'',
            itemName:'',
            data:[]
        };

        // Set default value
        if ( !$scope.isFirstTimeCreate ) {
            $scope.pjNameOption = $scope.pjArr[0];
        }


    /**
     *  Input validation
     */
        $scope.validCheck = function() {
            $scope.emptyItemName =
                $scope.saveForm.itemName.$error.required;
            $scope.emptyItemNameClass =
                $scope.saveForm.itemName.$dirty &&
                $scope.emptyItemName;

            $scope.emptyPjName =
                '' === $scope.pj4form.pjName;
            $scope.emptyPjNameClass =
                $scope.saveForm.pjName.$dirty &&
                $scope.emptyPjName;

            $scope.$parent.invalidForm =
                $scope.emptyItemName ||
                $scope.emptyPjName && $scope.isAddingNewPj;
        };

    /**
     *  Update the object data in "localStorageFactory"
     */
        $scope.update = function() {
            $scope.isAddingNewPj = $scope.pjNameOption === null;
            $scope.validCheck();
        };


        $scope.submit = function (overwrite) {
            // Refresh the result from the combo box
            if ( !$scope.isAddingNewPj && !$scope.isFirstTimeCreate ) {
                $scope.pj4form.pjName = $scope.pjNameOption.name;
            }

            $scope.data.display.storage   = $scope.getStorage();
            $scope.data.display.bandwidth = $scope.getBandwidth();

            if (!localStorageFactory.pj.addItem( $scope.pj4form.itemName,
                    $scope.pj4form.pjName, $scope.data, $scope.onNVR, overwrite )){
                $scope.overwriteAlert.push({ type: 'warning', msg: 'The name already exists!' });
                $scope.saveAgain = true;
            } else {
                alertService.flash({ type: 'success', msg: 'Successfully saved!' });
                $scope.saveAgain = false;
                $scope.closeModal();
            }
        };

        $scope.openModal = function (size) {

            $scope.modalInstance = $uibModal.open({
                templateUrl: 'views/save.html',
                size: size,
                scope: $scope
            });
        };

        $scope.closeModal = function () {
            $scope.modalInstance.close();
        };
}]);
