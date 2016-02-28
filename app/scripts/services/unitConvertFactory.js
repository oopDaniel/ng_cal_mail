'use strict';

angular.module('calculatorApp')
    .service('unitConvertFactory', ['$filter', function($filter) {


        var storageUnitArr   = ['GB'  , 'TB'  , 'PB'];
        var bandwidthUnitArr = ['Mbps', 'Gbps', 'Tbps'];


        this.setData = function(obj) {
            display.setup(obj);
        };

        this.getTotalStorage = function(obj) {
            var result = display.countTotalStorage(obj);
            var unit   = storageUnitArr[result[1]];
            return [ result[0], unit ];
        };

        this.getTotalBandwidth = function(obj) {
            var result = display.countTotalBandwidth(obj);
            var unit   = bandwidthUnitArr[result[1]];
            return [ result[0], unit ];
        };

        this.getStorage = function(num) {
            var result = display.doTheMath(num);
            var unit   = storageUnitArr[result[1]];
            return [ result[0], unit ];
        };

        this.getBandwidth = function(num) {
            var result = display.doTheMath(num);
            var unit   = bandwidthUnitArr[result[1]];
            return [ result[0], unit ];
        };


        function Displayer() {
            var self = this;

            this.countTotalStorage = function(obj) {
                if (obj) {
                    var storage = 0;
                    for (var i in obj.data) {
                        storage += parseFloat(obj.data[i].data.display.storage);
                    }
                    return self.doTheMath(storage);
                } else {
                    throw 'Failed to setup';
                }
            };

            this.countTotalBandwidth = function(obj) {
                if (obj) {
                    var bandwidth = 0;
                    for (var i in obj.data) {
                        bandwidth += parseFloat(obj.data[i].data.display.bandwidth);
                    }
                    return self.doTheMath(bandwidth);
                } else {
                    throw 'Failed to setup';
                }
            };
        }

        Displayer.prototype = {
            isObjPassed: false,
            obj: null,

            doTheMath: function(num) {
                var cv = new Converter(num);
                return [$filter('number')(cv.result, 1), cv.counter];
            }
        };


        function Converter(num) {
            var self     = this;
            self.counter = 0;

            function unitConverter(num) {
                if (num > 1024) {
                    self.counter++;
                    return unitConverter(num / 1024);
                }
                return num;
            }

            self.result = unitConverter(num);
        }




        // Can't new an instance b4 its definition
        var display = new Displayer();



    }]);
