'use strict';

angular.module('calculatorApp')
    .service('localStorageFactory', ['$window', function($window) {

        var nvrObj = new NVRObj();
        var cmsObj = new CMSObj();
        this.pj    = new Projects();

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

        // this.getPj = function() {
        //     return pj;
        // };

        // this.setPj = function(pjObj) {
        //     pj = pjObj;
        // };


        // ********** "this.pj.getPj is not a function" ***********
        // console.log(this.pj.getPj(1));
        // console.log(this.pj.getPj.call(this.pj, 1));
        // console.log(Projects.getPj(1));
        // ********************************************************


//----------------------------------------------------------------------
//----------------------------------------------------------------------


        function Projects() {
            var me          = this;
            this.projects = loadData();

            this.updateStatus = function () {
                this.length = this.projects.length;
                this.hasData = ( this.length > 0 );
            };

            this.updateStatus();

            this.renamePj = function (oldName, newName) {
                var index = getPjIndex(oldName);
                this.projects[index].name = newName;
                storeData();
            };

            this.addItem = function (itemName, pjName, data, onNVR) {
                var index = getPjIndex(pjName);
                var old   = this.projects[index];
                var type = "CMS";

                if ( onNVR ) {
                    data = str2Int(data);
                    type = "NVR";
                }

                var id = getNextId(old.data,"_id");
                var item = {
                    _id  : id,
                    name : itemName,
                    type : type,
                    data : data
                };

                old.data.push(item);
                old.storage   += item.data.display.storage;
                old.bandwidth += item.data.display.bandwidth;
                old.count[type]++;
                storeData();
            };

            this.editItem = function ( pId, itemId, data, onNVR ) {
                var indexP = findByAttr( this.projects, "_id", pId);
                var old    = this.projects[indexP];
                var index  = findByAttr( old.data, "_id", itemId);
                var oldData = old.data[index].data;

                old.storage -= oldData.display.storage;
                old.storage += data.display.storage;
                old.bandwidth -= oldData.display.bandwidth;
                old.bandwidth += data.display.bandwidth;

                oldData = data;
                storeData();

            }

            this.getPj = function(id) {
                var index = findByAttr( this.projects, "_id", id);
                return this.projects[ index ];
            };

            this.getItem = function(pid, itemid) {
                var pindex = findByAttr( this.projects, "_id", pid);
                var index  = findByAttr( this.projects[pindex].data, "_id", itemid);
                return this.projects[ pindex ].data[ index ];
            };

            this.deletePj = function (id) {
                var index = findByAttr( this.projects, "_id", id);
                if ( undefined !== index ) {
                    this.projects.splice(index, 1);
                    this.updateStatus();
                    if ( !this.hasData ) {
                        $window.localStorage.removeItem("projects");
                    } else {
                        storeData();
                    }
                }
            };


            this.deleteItem = function (id, pid) {
                var indexP = findByAttr( this.projects, "_id", pid);
                var arr    = this.projects[indexP].data;
                var index  = findByAttr( arr, "_id", id);

                if ( undefined !== index ) {
                    var type = arr[index].type;
                    if ( "NVR" === type ) {
                        this.projects[indexP].count.NVR--;
                        this.projects[indexP].storage -= arr[index].data.display.storage;
                    } else {
                        this.projects[indexP].count.CMS--;
                    }
                        this.projects[indexP].bandwidth -= arr[index].data.display.bandwidth;

                    arr.splice(index, 1);
                    storeData();
                }
            };



            function getPjIndex (pjName) {
                var index = findByAttr( me.projects, "name", pjName );
                if ( undefined === index) {
                    var pj = new NewPJ(pjName);
                    var id = getNextId(me.projects,"_id");
                    me.projects.push(pj);
                    me.updateStatus();
                    me.projects[me.length - 1]._id = id;
                    return me.length - 1;
                }
                return index;
            }

            function str2Int (obj) {
                obj.estDays.params.cameras = parseInt(obj.estDays.params.cameras);
                obj.estDays.params.motion  = parseInt(obj.estDays.params.motion);
                obj.estDays.params.rHours  = parseInt(obj.estDays.params.rHours);
                return obj;
            }

            function findByAttr (arr, attr, value) {
                for( var i = 0, l = arr.length; i < l; i++ ) {
                    if( arr[i][attr] === value ) {
                        return i;
                    }
                }
            }

            function getNextId (arr, attr) {
                var l = arr.length;
                if ( l > 0 ) {
                    for( var i = 0; i < l; i++ ) {
                        if( arr[i][attr] !== ( i + 1 ) ) {
                            return i;
                        }
                    }
                    return i + 1;
                }
                return 1;
            }

            function loadData () {
                try {
                    return JSON.parse($window.localStorage["projects"]);
                } catch(e) {
                    return [];
                }
            }

            function storeData () {
                try {
                    $window.localStorage["projects"] = JSON.stringify(me.projects);
                } catch(e) {
                    console.log("exception: " + e);
                }
                me.updateStatus();
            }

        }

        Projects.prototype = {
            projects : null,
            hasData  : false,

            getPjs : function() {
                return this.projects;
            }


            // ******** This doesn't work ************
            // ,
            // getPj : function(index) {
            //     return projects[index];
            // }

            // ***************************************

        };

        // ******** This doesn't work ************

        // Projects.prototype.getPj = function(index) {
        //         return this.projects[index];
        // };

        // ***************************************





        // Class NewPJ
        function NewPJ(pjName) {
            this._id        = 0;
            this.name       = pjName;
            this.storage    = 0;
            this.bandwidth  = 0;
            this.data       = [];
            this.count      = {
                NVR: 0,
                CMS: 0
            };
        }

        function MyObj() {
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
            this.HDDsize  = "3 TB";
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
