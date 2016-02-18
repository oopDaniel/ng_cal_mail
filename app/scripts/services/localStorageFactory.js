'use strict';

angular.module('calculatorApp')
    .service('localStorageFactory', ['$window', function($window) {

        this.defaultNewPjStr = "(Create New Project)";

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

        this.storeObj = function(key, value) {
            if ( 'NVR' === key ) {
                Str2Int('NVR');
                $window.localStorage[key] = JSON.stringify(NVRObj);
            } else if ( 'CMS' === key ) {
                Str2Int('CMS');
                $window.localStorage[key] = JSON.stringify(CMSObj);
            } else {
                $window.localStorage[key] = JSON.stringify(value);
            }
        };

        this.getStoredObj = function(key, defaultValue) {
            if ( 'NVR' === key ) {
                return $window.localStorage[key] === undefined ?
                    NVRObj : JSON.parse($window.localStorage[key]);
            } else if ( 'CMS' === key ) {
                 return $window.localStorage[key] === undefined ?
                    CMSObj : JSON.parse($window.localStorage[key]);
            } else {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        };

        var Str2Int = function (obj) {
            obj.estDays.params.cameras = parseInt(obj.estDays.params.cameras);
            obj.estDays.params.motion  = parseInt(obj.estDays.params.motion);
            obj.estDays.params.rHours  = parseInt(obj.estDays.params.rHours);
            return obj;
        };

        var projects = [{name:"123",NVR:[],CMS:[]},{name:"456",NVR:[],CMS:[]},{name:this.defaultNewPjStr}];

        this.getPjArr = function() {
            return projects;
        };

        this.getPjIndex = function(pjName) {
            return projects.indexOf(pjName);
        };

        this.pushPj = function(data) {
            projects.unshift(data);
        };

        this.pushPjData = function(index, itemName, data, onNVR) {
            data = Str2Int(data);
            var item = {
                name:itemName,
                data:data
            }
            if ( onNVR ) {
                projects[index].NVR.push(item);
            } else {
                projects[index].CMS.push(item);
            }
        };

        this.store = function() {
            $window.localStorage["projects"] = JSON.stringify(projects);
        }


    }]);
