'use strict';

angular.module('calculatorApp').controller('MailCtrl', ['$scope', '$cordovaEmailComposer', function($scope, $cordovaEmailComposer) {

    var email = {
        to: 'daniel.chiang@isapsolution.com',
        cc: '',
        bcc: [''],
        attachments: [
            'file://images/yeoman.png'
        ],
        subject: 'Cordova Email Test',
        body: 'yo'
    };

    document.addEventListener('deviceready', function() {

        $cordovaEmailComposer.isAvailable().then(function() {
            $scope.sendmail = function() {
                $cordovaEmailComposer.open(email).then(null, function() {
                });
            };
        }, function() {
            window.alert('Email is not available now!');
        });
    }, false);

}]);
