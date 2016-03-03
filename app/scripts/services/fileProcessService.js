'use strict';

angular.module('MyApp')
  .service('fileProcessService', ['$window', function($window) {



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


    function storedData2Str(ids) {
        var obj = loadData (ids),
            tmp = '';
        for ( var i in obj ) {
            if ( i > 0 ) {
                tmp += '\n';
            }
            tmp     += 'id: ' + obj[i]._id + ', name: ' +
                       obj[i].name + '\n' ;
            for ( var j in obj[i].data ) {

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

    this.mailFileStr = function(ids) {
        var fileStr = titleStr + storedData2Str(ids),
            base64  = 'base64:file.txt//' + btoa(fileStr);
        return base64;
    };


}]);
