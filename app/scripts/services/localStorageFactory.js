'use strict';

angular.module('calculatorApp')
    .service('localStorageFactory', ['$window', function($window) {

        var self = this;
        this.defaultNewPjStr = "(Create New Project)";

        var nvrObj = new NVRObj();
        var cmsObj = new CMSObj();
        var pj = new Projects();

        this.getDefaultNVRObj = function() {
            return nvrObj;
        };

        this.getDefaultCMSObj = function() {
            return cmsObj;
        };

        this.setDefaultNVRObj = function(obj) {
            nvrObj = obj;
        };

        this.setDefaultCMSObj = function(obj) {
            cmsObj = obj;
        };

        this.getPj = function() {
            return pj;
        };

        this.setPj = function(pjObj) {
            pj = pjObj;
        };


//----------------------------------------------------------------------
//----------------------------------------------------------------------



        // var projects = [];
        // var hasData;

        // this.getPjArr = function() {
        //     loadPj();
        //     return projects;
        // };

        // this.renamePj = function(oldName, newName) {
        //     var index = getPjIndex(oldName);
        //     loadPj();
        //     projects[index].name = newName;
        //     storePj();
        // };

        // // Used to store data in the local storage
        // this.pushPjData = function(itemName, pjName, data, onNVR) {

        //     var index = getPjIndex(pjName);

        //     var targetArr = projects[index].CMS;
        //     if ( onNVR ) {
        //         data      = str2Int(data);
        //         targetArr = projects[index].NVR;
        //     }
        //     var item = {
        //         name:itemName,
        //         data:data
        //     };
        //     targetArr.push(item);
        //     storePj();
        // };



        // // Load projects from local storage
        // var loadPj = function() {
        //   hasData = undefined !== $window.localStorage["projects"];
        //   if ( hasData ) {
        //     projects = JSON.parse($window.localStorage["projects"]);
        //     // Add the option of "(Create New Project)"
        //     projects.push(createPjStr);
        //   }
        // };

        // var storePj = function() {
        //     if ( hasData ) {
        //         // Remove the option of "(Create New Project)"
        //         projects.pop();
        //     }
        //     $window.localStorage["projects"] = JSON.stringify(projects);
        // };

        // var getPjIndex = function(pjName) {
        //     var index = findByAttr( projects, "name", pjName );
        //     if ( undefined === index ) {
        //         var pj = new NewPJ(pjName);
        //         projects.unshift(pj);
        //         return 0;
        //     }
        //     return index;
        // };

        // var str2Int = function (obj) {
        //     obj.estDays.params.cameras = parseInt(obj.estDays.params.cameras);
        //     obj.estDays.params.motion  = parseInt(obj.estDays.params.motion);
        //     obj.estDays.params.rHours  = parseInt(obj.estDays.params.rHours);
        //     return obj;
        // };

        // var findByAttr = function (array, attr, value) {
        //     for(var i = 0, l = array.length; i < l; i++) {
        //         if(array[i][attr] === value) {
        //             return i;
        //         }
        //     }
        // };



        function Projects() {
            var me          = this;
            this.projects   = loadData();

            var createPjStr = { name: self.defaultNewPjStr };

            this.updateStatus = function () {
                this.hasData = ( this.projects.length > 0 );
                if ( this.hasData ) {
                    this.projects.push(createPjStr);
                }
            };
            this.updateStatus();

            this.renamePj = function (oldName, newName) {
                var index = getPjIndex(oldName);
                this.projects[index].name = newName;
                console.log(newName);
                console.log(this.projects[index].name);
                storeData();
            };

            this.pushPjData = function (itemName, pjName, data, onNVR) {
                var index = getPjIndex(pjName);
                var targetArr = this.projects[index].CMS;

                if ( onNVR ) {
                    data      = str2Int(data);
                    targetArr = this.projects[index].NVR;
                }
                var item = {
                    name : itemName,
                    data : data
                };

                targetArr.push(item);
                storeData();
            };



            function getPjIndex (pjName) {
                var index = findByAttr( me.projects, "name", pjName );
                if ( undefined === index ) {
                    var pj = new NewPJ(pjName);
                    me.projects.unshift(pj);
                    return 0;
                }
                return index;
            };

            function str2Int (obj) {
                obj.estDays.params.cameras = parseInt(obj.estDays.params.cameras);
                obj.estDays.params.motion  = parseInt(obj.estDays.params.motion);
                obj.estDays.params.rHours  = parseInt(obj.estDays.params.rHours);
                return obj;
            };

            function findByAttr (arr, attr, value) {

                for(var i = 0, l = arr.length; i < l; i++) {
                    if(arr[i][attr] === value) {
                        return i;
                    }
                }
            };

            function loadData () {
                try {
                    return JSON.parse($window.localStorage["projects"]);
                } catch(e) {
                    return [];
                }
            };

            function storeData () {
                if ( me.hasData ) {
                    // Remove the option of "(Create New Project)"
                    me.projects.pop();
                }
                try {
                    $window.localStorage["projects"] = JSON.stringify(me.projects);
                } catch(e) {
                    console.log("exception: " + e);
                }
          };

        }

        Projects.prototype = {
            projects : null,
            hasData  : false,

            getPjs : function() {
                return projects;
            },
            getPj : function(index) {
                return projects[index];
            }
        };

        // Class NewPJ
        function NewPJ(pjName) {
            this.name       = pjName;
            this.storage    = 0;
            this.bandwidth  = 0;
            this.NVR        = [];
            this.CMS        = [];
        }

        function MyObj() {
            this.itemName = '';
            this.display  = {
                bandwidth:64,
                bandwidthUnit:'Mbps',
            };
            this.cameras  = 16;
            this.bitRate  = {
                data:4,
                params:{
                  codec:'H.264',
                  quality:'Medium',
                  resolution:'Full HD (1920 x 1080)',
                  FPS:30
                }
            };
        }

        function NVRObj() {
            MyObj.call(this);
            this.display.storage     = 960;
            this.display.storageUnit = 'TB';
            this.estDays  = {
                data:10,
                params:{
                  rDays:30,
                  rHours:16,
                  motion:50,
                }
            };
            this.RAID     = '5';
            this.HDDsize  = 3;
        }
        NVRObj.prototype = new MyObj();

        function CMSObj() {
            MyObj.call(this);
            this.display.storage = '-';
            this.estDays  = {
                data:10,
                params:{
                  rDays:30,
                  rHours:16,
                  motion:50,
                }
            };
            this.local       = true;
            this.remoteUsers = 10;
        }
        CMSObj.prototype = new MyObj();

    }]);
