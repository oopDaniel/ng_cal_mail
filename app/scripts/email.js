'use strict';

angular.module('calculatorApp').controller('MailCtrl', ['$scope', function($scope, $cordovaEmailComposer) {



        var email = {
            to: 'daniel.chiang@isapsolution.com',
            cc: '',
            bcc: [''],
            attachments: [
                'file://images/yeoman.png'
            ],
            subject: 'Cordova Email Test',
            body: 'yo',
            isHtml: true
        };

        $scope.sendmail = function() {
            $cordovaEmailComposer.open(email).then(null, function() {
                console.log('you\'ve closed the email');
                // user cancelled email
            });
        };

}]);
