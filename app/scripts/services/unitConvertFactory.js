'use strict';

angular.module('calculatorApp')
    .service('unitConvertFactory', ['$filter', function($filter) {

    this.setData = function (obj) {
        display.setup(obj);
    };

    this.getTotalStorage = function () {
        return display.countTotalStorage();
    };

    this.getTotalBandwidth = function () {
        return display.countTotalBandwidth();
    };

    this.getStorage = function (num) {
        return display.countStorage(num);
    };

    this.getBandwidth = function (num) {
        return display.countBandwidth(num);
    };

    this.getStorageUnit = function () {
        return display.storageUnit;
    };

    this.getBandwidthUnit = function () {
        return display.bandwidthUnit;
    };

    function Displayer () {
        var self = this;

        this.setup = function (obj) {
            this.obj = obj;
            this.isObjPassed = true;
        }

        // this.countStorage = function (num) {
        //     var cv = new Converter(num);
        //     self.storageUnit = self.storageUnitArr[cv.counter];
        //     return $filter("number")( cv.result, 1 );
        // };

        this.countTotalStorage = function () {
            if ( this.isObjPassed ) {
                var storage = 0;
                for ( var i in this.obj.NVR ) {
                    storage += parseFloat(this.obj.NVR[i].data.display.storage);
                }
                return self.countStorage(storage);
            }
            return "Failed to setup";
        };

        this.countTotalBandwidth = function () {
            if ( this.isObjPassed ) {
                var bandwidth = 0;
                for ( var i in this.obj.NVR ) {
                    bandwidth += parseFloat(this.obj.NVR[i].data.display.bandwidth);
                }
                for ( var i in this.obj.CMS ) {
                    bandwidth += parseFloat(this.obj.CMS[i].data.display.bandwidth);
                }
                return self.countBandwidth(bandwidth);
            }
            return "Failed to setup";
        };
    }

    Displayer.prototype = {
        isObjPassed : false,
        obj : null,
        storageUnitArr  : ["GB","TB","PB"],
        bandwidthUnitArr : ["Mbps","Gbps","Tbps"],
        storageUnit   : 'defaultUnit',
        bandwidthUnit : 'defaultUnit'

        //************ This doesn't work ******************
        ,
        countStorage  : function(num) {
            var cv = new Converter(num);
            this.storageUnit = this.storageUnitArr[cv.counter];
            return $filter("number")( cv.result, 1 );
        },
        countBandwidth : function (num) {
            var cv = new Converter(num);
            this.bandwidthUnit = this.bandwidthUnitArr[cv.counter];
            return $filter("number")( cv.result, 1 );
        }
        //**************************************************
    };


    function Converter (num) {
        var self     = this;
        this.counter = 0;
        this.result  = unitConverter(num);

        function unitConverter (num) {
            if ( num > 10240 ) {
                self.counter++;
                return unitConverter( num / 1024 );
            }
            return num;
        };
    }




    // Can't new an instance b4 its definitions
    var display = new Displayer();









}]);
