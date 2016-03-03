'use strict';

angular.module('MyApp')
    .service('alertService', ['$timeout', function($timeout) {

        var self = this,
            msg  = [];

        self.flash = function(obj) {
            msg.push(obj);
            $timeout(killFlash, 1500);
        };

        self.getFlash = function() {
            return msg;
        };

        function killFlash() {
            msg.pop();
        }

    }]);
