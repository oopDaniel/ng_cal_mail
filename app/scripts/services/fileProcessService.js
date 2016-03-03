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
            // if ( i > 0 ) {
            //     tmp += '\n';
            // }
            // tmp     += 'id: ' + obj[i]._id + ', name: ' +
            //            obj[i].name + '\n' ;
            // tmp     +=

            if (typeof target[k] !== 'function') {
                    console.log("Key is " + k + ", value is" + target[k]);
               }

        }
        return tmp;
    }

    this.mailFileStr = function(ids) {
        var fileStr = storedData2Str(ids),
            base64  = 'base64:file.txt//' + btoa(fileStr);
        return base64;
    };


}]);
