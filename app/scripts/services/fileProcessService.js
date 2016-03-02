'use strict';

angular.module('calculatorApp')
  .service('fileProcessService', ['$window', function($window) {

    var title = [
      'Project ID',
      'Project Name',
      'Total Storage',
      'Total Bandwidth',
      'NVR Count',
      'CMS Count',
      'Item ID',
      'Item Name',
      'Type',
      'Storage',
      'Bandwidth',
      'Cameras',
      'Bit Rate',
      'Codec',
      'Quality',
      'Resolution',
      'FPS',
      'Estimated Days',
      'Recording Days',
      'Recording Hours',
      'Motion(%)',
      'RAID Type',
      'HDD Size',
      'Local User',
      'Remote Users'
    ];

    var titleStr  = title.join() + '\n';






    function addComma(len) {
        var commas    = [];
        commas.length = len + 1;  // length = (25+1) for displaying 25 commas
        return commas.join();
    }

    function loadData (ids) {
        var tmp, arr = [];
        try {
            tmp = JSON.parse($window.localStorage.projects);
        } catch (e) {
            tmp = [];
        }

        ids.sort();

        for ( var i in ids ) {
            var index = findByAttr(tmp, '_id', ids[i]);
            arr[arr.length] = tmp[index];
        }
        return arr;
    }

    function findByAttr(arr, attr, value) {
        for ( var i = 0, l = arr.length; i < l; i++ ) {
            if ( arr[i][attr] === value ) {
                return i;
            }
        }
        return -1;
    }


    /***************************
      Need to Convert the Unit?
    ****************************/

    function storedData2Str(ids) {
        var obj = loadData (ids),
            tmp = '';
        for ( var i in obj ) {
            if ( i > 0 ) {
                tmp += '\n';
            }
            tmp     += obj[i]._id       + ',' +
                       obj[i].name      + ',' +
                       obj[i].storage   + ',' +
                       obj[i].bandwidth + ',' +
                       obj[i].count.NVR + ',' +
                       obj[i].count.CMS;
            tmp     += addComma(19) + '\n' + addComma(6);
            for ( var j in obj[i].data ) {
                if ( j > 0 ) {
                    tmp += addComma(6);
                }
                var inf     = obj[i].data[j],
                    type    = inf.type,
                    data    = inf.data,
                    bitRate = data.bitRate,
                    estDays = data.estDays;

                tmp        += inf._id                   + ',' +
                              inf.name                  + ',' +
                              type                      + ',' +
                              data.display.storage      + ',' +
                              data.display.bandwidth    + ',' +
                              data.cameras              + ',' +
                              bitRate.data              + ',' +
                              bitRate.params.codec      + ',' +
                              bitRate.params.quality    + ',' +
                              bitRate.params.resolution + ',' +
                              bitRate.params.FPS        + ',' ;

                tmp     += 'NVR' === type ?
                              estDays.data              + ',' +
                              estDays.params.rDays      + ',' +
                              estDays.params.rHours     + ',' +
                              estDays.params.motion     + ',' +
                              data.RAID                 + ',' +
                              data.HDDsize              + ',' +
                              data.local              :
                              addComma(6)               +
                              data.local                + ',' +
                              data.remoteUsers;
                tmp     += '\n';
            }
        }
        return tmp;
    }

// var fs = require('fs')
//

    this.saveFile = function(ids) {
        var fileStr = titleStr + storedData2Str(ids),
            file    = new Blob([fileStr], {type: 'text/plain;charset=utf-8'});
        saveAs(file, 'data.csv');
    };

    this.mailFileStr = function(ids) {
        var fileStr = titleStr + storedData2Str(ids),
            base64  = 'base64:file.csv//' + btoa(fileStr);
        return base64;
    };


}]);
