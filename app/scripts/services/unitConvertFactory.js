'use strict';

angular.module('calculatorApp')
    .service('unitConvertFactory', ['$filter', function($filter) {


    var storageUnitArr   = ["GB","TB","PB"];
    var bandwidthUnitArr = ["Mbps","Gbps","Tbps"];

    this.setData = function (obj) {
        display.setup(obj);
    };

    this.getTotalStorage = function () {
        var result = display.countTotalStorage();
        var unit   = storageUnitArr[ result[1] ];
        return [ result[0], unit ];
    };

    this.getTotalBandwidth = function () {
        var result = display.countTotalBandwidth();
        var unit   = bandwidthUnitArr[ result[1] ];
        return [ result[0], unit ];
    };



    // this.getStorageUnit = function () {
    //     return display.storageUnit;
    // };

    // this.getBandwidthUnit = function () {
    //     return display.bandwidthUnit;
    // };

    function Displayer () {
        var self = this;

        this.setup = function (obj) {
            this.obj = obj;
            this.isObjPassed = true;
        };

        // this.countStorage = function (num) {
        //     var cv = new Converter(num);
        //     self.storageUnit = self.storageUnitArr[cv.counter];
        //     return $filter("number")( cv.result, 1 );
        // };

        this.countTotalStorage = function () {
            if ( this.isObjPassed ) {
                var storage = 0;
                for ( var i in this.obj.data ) {
                    storage += parseFloat(this.obj.data[i].data.display.storage);
                }
                return self.doTheMath(storage);
            }
            return "Failed to setup";
        };

        this.countTotalBandwidth = function () {
            if ( this.isObjPassed ) {
                var bandwidth = 0;
                for ( var i in this.obj.data ) {
                    bandwidth += parseFloat(this.obj.data[i].data.display.bandwidth);
                }
                return self.doTheMath(bandwidth);
            }
            return "Failed to setup";
        };
    }

    Displayer.prototype = {
        isObjPassed : false,
        obj         : null,

        //************ This doesn't work ******************

        doTheMath : function (num) {
            var counter = 0;
            var result = unitConverter(num);

            // function unitConverter (n) {
            //     // if ( num > 10240 ) {
            //     if ( n <= 1024 ) return n;
            //     counter++;
            //     n = unitConverter( n / 1024 );
            //     return n;
            // }
            function unitConverter (n) {
                for ( var i = n; i > 1024; counter++ ) {
                    i /= 1024;
                }
                return i;
            }

            // console.log("counter: "+counter)

            return [ $filter("number")( result, 1 ), counter ];
        }
        //**************************************************
    };


    // function Converter (num) {
    //     var self     = this;
    //     this.counter = 0;

        // function unitConverter (num) {
        //     // if ( num > 10240 ) {
        //     if ( num > 1024 ) {
        //         self.counter++;
        //         return unitConverter( num / 1024 );
        //     }
        //     return num;
        // }
    //     function unitConverter (n) {
    //         for ( var i = n; i > 1024; self.counter++ ) {
    //             i /= 1024;
    //         }
    //         return i;
    //     }
    //         console.log(self.counter)
    //     this.result  = unitConverter(num);
    // }

//--------------------------------------------------------------

//--------------------------------------------------------------

    // Can't new an instance b4 its definitions
    var display = new Displayer();


    function unitConverter (n) {
        var num = n
        var i = 0;
        for ( i; num > 1024;  i++) {
            num /= 1024;
        }

        return [num,i];
    }


    this.getStorage = function (num) {
        // var c = new Converter(num);
        var arr = unitConverter(num)
        var unit = storageUnitArr[ arr[1] ];
        console.log(arr)
        return [ $filter("number")( arr[0], 1 ), unit ];
    };

    this.getBandwidth = function (num) {
        // var result = display.doTheMath(num);
        var arr = unitConverter(num)
        // var unit   = bandwidthUnitArr[ result[1] ];
        var unit   = bandwidthUnitArr[ arr[1] ];
        // return [ result[0], unit ];
        return [ $filter("number")( arr[0], 1 ), unit ]
    };



}]);
