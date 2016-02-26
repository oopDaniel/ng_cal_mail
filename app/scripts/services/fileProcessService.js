'use strict';

angular.module('calculatorApp')
  .service('fileProcessService', ['$window', function($window) {

    var title = [
      "Project ID",
      "Project Name",
      "Total Storage",
      "Total Bandwidth",
      "NVR Count",
      "CMS Count",
      "Item ID",
      "Item Name",
      "Type",
      "Storage",
      "Bandwidth",
      "Cameras",
      "Bit Rate",
      "Codec",
      "Quality",
      "Resolution",
      "FPS",
      "Estimated Days",
      "Recording Days",
      "Recording Hours",
      "Motion(%)",
      "RAID Type",
      "HDD Size",
      "Local User",
      "Remote Users"
    ];

    var titleStr  = title.join() + "\n";






    function addComma(len) {
        var commas    = [];
        commas.length = len + 1;  // length = (25+1) for displaying 25 commas
        return commas.join();
    }

    function loadData () {
        try {
            return JSON.parse($window.localStorage.projects);
        } catch(e) {
            return [];
        }
    }




    /***************************
      Need to Convert the Unit?
    ****************************/

    function storedData2Str() {
        var obj = loadData ();
        var tmp = '';
        for ( var i in obj ) {
            tmp     += obj[i]._id       + "," +
                       obj[i].name      + "," +
                       obj[i].storage   + "," +
                       obj[i].bandwidth;
            tmp     += addComma(19) + "\n" + addComma(6);
            for ( var j in obj[i].data ) {
                var inf     = obj[i].data[j];
                var type    = inf.type;
                var data    = inf.data;
                var bitRate = data.bitRate;
                var estDays = data.estDays;
                tmp        += inf._id                   + "," +
                              inf.name                  + "," +
                              type                      + "," +
                              data.display.storage      + "," +
                              data.display.bandwidth    + "," +
                              data.cameras              + "," +
                              bitRate.data              + "," +
                              bitRate.params.codec      + "," +
                              bitRate.params.quality    + "," +
                              bitRate.params.resolution + "," +
                              bitRate.params.FPS        + "," ;

                tmp     += "NVR" === type ?
                              estDays.data              + "," +
                              estDays.params.rDays      + "," +
                              estDays.params.rHours     + "," +
                              estDays.params.motion     + "," +
                              data.RAID                 + "," +
                              data.HDDsize              + "," +
                              data.local              :
                              addComma(6)               +
                              data.local                + "," +
                              data.remoteUsers;
                tmp     += "\n";
            }
        }
        return tmp;
    }

// var fs = require('fs')
//





    this.saveFile = function() {
        var fileStr = titleStr + storedData2Str(),
            file    = new Blob([fileStr], {type: "text/plain;charset=utf-8"});
        saveAs(file, "data.csv");
    };


}]);
