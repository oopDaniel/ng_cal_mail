'use strict';

angular.module('calculatorApp')
    .service('alertService', ['$timeout', function($timeout) {

        var self = this,
            msg  = [];

        self.flash = function(obj) {
            msg.push(obj);
            $timeout(killFlash, 2000);
        };

        self.getFlash = function() {
            return msg;
        };

        function killFlash() {
            msg.pop();
        }

    }]);
