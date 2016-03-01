angular.module('calculatorApp').controller('MailCtrl', ['$scope', function($scope, $cordovaEmailComposer) {


    console.log("--in Mail Ctrl--");

    document.addEventListener('deviceready', function () {
        $cordovaEmailComposer.isAvailable().then(function() {
                console.log('Email function is now available');
            }, function() {
                console.log('email function is inaccessable');
            });


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

     }, false);
}]);
