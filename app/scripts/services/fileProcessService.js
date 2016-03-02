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


    var myStr = "Project ID,Project Name,Total Storage,Total Bandwidth,NVR Count,CMS Count,Item ID,Item Name,Type,Storage,Bandwidth,Cameras,Bit Rate,Codec,Quality,Resolution,FPS,Estimated Days,Recording Days,Recording Hours,Motion(%),RAID Type,HDD Size,Local User,Remote Users\n1,321,47740824.56250001,289212.19,2,1,,,,,,,,,,,,,,,,,,,\n,,,,,,1,123,NVR,104287.5,988.8,160,6.18,H.264,Medium,Full HD (1920 x 1080),30,10,30,16,50,5,3 TB,true\n,,,,,,2,CSV,CMS,0,5932.799999999999,160,6.18,H.264,Medium,Full HD (1920 x 1080),30,,,,,,,false,6\n,,,,,,3,PB,NVR,47636537.06250001,282290.59,29999,9.41,H.264,Medium,3MP,30,16,30,16,80,1,2 TB,false\n3,Hello,10428.749999999998,98.88,1,0,,,,,,,,,,,,,,,,,,,\n,,,,,,1,g,NVR,10428.749999999998,98.88,16,6.18,H.264,Medium,Full HD (1920 x 1080),30,10,30,16,50,5,3 TB,false";


    this.saveFile = function(ids) {
        var fileStr = titleStr + storedData2Str(ids),
            file    = new Blob([fileStr], {type: 'text/plain;charset=utf-8'});
        console.log(fileStr);
        var base64  = btoa(myStr);
        return base64;
        // saveAs(file, 'data.csv');
    };


}]);
