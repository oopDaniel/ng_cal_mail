'use strict';

angular.module('calculatorApp')
    .service('localStorageFactory', ['$window', function($window) {

        this.defaultNewPjStr = "(Create New Project)";
        var newPjObj = { name: this.defaultNewPjStr };

        var NVRObj={
          itemName:'',
          display: {
            storage:960,
            storageUnit:'TB',
            bandwidth:64,
            bandwidthUnit:'Mbps',
          },
          cameras:16,
          bitRate: {
            data:4,
            params:{
              codec:'H.264',
              quality:'Medium',
              resolution:'Full HD (1920 x 1080)',
              FPS:30
            }
          },
          estDays: {
            data:10,
            params:{
              rDays:30,
              rHours:16,
              motion:50,
            }
          },
          RAID:'5',
          HDDsize:3
        };

        var CMSObj={
          itemName:'',
          display: {
            storage:'-',
            bandwidth:64,
            bandwidthUnit:'Mbps',
          },
          cameras:16,
          bitRate: {
            data:4,
            params:{
              codec:'H.264',
              quality:'Medium',
              resolution:'Full HD (1920 x 1080)',
              FPS:30
            }
          },
          local:true,
          remoteUsers:10
        };

        this.getDefaultNVRObj = function() {
            return NVRObj;
        };

        this.getDefaultCMSObj = function() {
            return CMSObj;
        };

        this.setDefaultNVRObj = function(obj) {
            NVRObj = obj;
        };

        this.setDefaultCMSObj = function(obj) {
            CMSObj = obj;
        };


//----------------------------------------------------------------------

//----------------------------------------------------------------------


        var projects = [];
        var hasData;

        this.loadPj = function() {
          hasData = undefined !== $window.localStorage["projects"];
          if ( hasData ) {
            projects = JSON.parse($window.localStorage["projects"]);
            // Add the option of "(Create New Project)"
            projects.push(newPjObj);
          }
        };

        this.getPjArr = function() {
            return projects;
        };

        this.getPjIndex = function(pjName) {
            return findByAttr( projects, "name", pjName );
        };

        this.pushPj = function(data) {
            console.log("in pushPJ, data: "+data);
            console.log(projects);
            projects.unshift(data);
        };

        this.pushPjData = function(index, itemName, data, onNVR) {
            data = str2Int(data);
            var item = {
                name:itemName,
                data:data
            };
            if ( onNVR ) {
                projects[index].NVR.push(item);
            } else {
                projects[index].CMS.push(item);
            }
        };

        this.store = function() {
            if ( hasData ) {
                // Remove the option of "(Create New Project)"
                projects.pop();
            }
            $window.localStorage["projects"] = JSON.stringify(projects);
        };




        var str2Int = function (obj) {
            obj.estDays.params.cameras = parseInt(obj.estDays.params.cameras);
            obj.estDays.params.motion  = parseInt(obj.estDays.params.motion);
            obj.estDays.params.rHours  = parseInt(obj.estDays.params.rHours);
            return obj;
        };

        var findByAttr = function (array, attr, value) {
            for(var i = 0, l = array.length; i < l; i++) {
                if(array[i][attr] === value) {
                    return i;
                }
            }
        };



    }]);
