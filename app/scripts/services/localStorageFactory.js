'use strict';

angular.module('calculatorApp')
    .service('localStorageFactory', ['$window', function($window) {


        this.pj    = new Projects();


//----------------------------------------------------------------------
//----------------------------------------------------------------------


        function Projects() {
            var self      = this;
            self.projects = loadData();

            this.updateStatus = function () {
                self.length = self.projects.length;
                self.hasData = ( self.length > 0 );
            };

            self.updateStatus();

            this.renamePj = function (oldName, newName) {
                var index = getPjIndex(oldName);
                self.projects[index].name = newName;
                storeData();
            };

            this.renameItem = function ( oldPjName, oldName, newName ) {
                var indexP = getPjIndex(oldPjName);
                var index  = findByAttr( self.projects[indexP].data, "name", oldName);
                self.projects[indexP].data[index].name = newName;
                storeData();
            };

            this.addItem = function ( itemName, pjName, data, onNVR, overwrite ) {
                var indexP = getPjIndex(pjName);
                var old    = self.projects[indexP];
                var index  = findByAttr( old.data, "name", itemName);

                if ( -1 !== index ) {
                    if ( !overwrite ) { // The name already exists
                        return false;
                    } else {            // Second round
                        // pjDisplayCorrect( oldData.display, data.display);
                        self.deleteItem(old.data[index]._id , old._id)
                    }
                }

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
                return true;
            };

            this.editItem = function ( pId, itemId, data ) {
                var indexP = findByAttr( self.projects, "_id", pId);
                var pj     = self.projects[indexP];
                var old    = loadData();
                var index  = findByAttr( pj.data, "_id", itemId);
                var oldData = old[indexP].data[index].data;

                pjDisplayCorrect( oldData.display, data.display);
                storeData();
            };

            function pjDisplayCorrect(subtrahend, addend) {
                pj.storage   -= subtrahend.storage;
                pj.bandwidth -= subtrahend.bandwidth;
                pj.storage   += addend.storage;
                pj.bandwidth += addend.bandwidth;
            }

            this.getPj = function(id) {
                var index = findByAttr( self.projects, "_id", id);
                return self.projects[ index ];
            };

            this.getItem = function(pid, itemid) {
                var pindex = findByAttr( self.projects, "_id", pid);
                var index  = findByAttr( self.projects[pindex].data, "_id", itemid);
                return self.projects[ pindex ].data[ index ];
            };

            this.deletePj = function (id) {
                var index = findByAttr( self.projects, "_id", id);
                if ( -1 !== index ) {
                    self.projects.splice(index, 1);
                    self.updateStatus();
                    if ( !self.hasData ) {
                        $window.localStorage.removeItem("projects");
                    } else {
                        storeData();
                    }
                }
            };


            this.deleteItem = function (id, pid) {
                var indexP = findByAttr( self.projects, "_id", pid);
                var arr    = self.projects[indexP].data;
                var index  = findByAttr( arr, "_id", id);

                if ( -1 !== index ) {
                    var type = arr[index].type;
                    if ( "NVR" === type ) {
                        self.projects[indexP].count.NVR--;

                    // BUG ????????????????????????????

                        self.projects[indexP].storage -= arr[index].data.display.storage;
                    } else {
                        self.projects[indexP].count.CMS--;
                    }
                        self.projects[indexP].bandwidth -= arr[index].data.display.bandwidth;

                    arr.splice(index, 1);
                    storeData();
                }
            };



            function getPjIndex (pjName) {
                var index = findByAttr( self.projects, "name", pjName );
                if ( -1 === index) {
                    var pj = new NewPJ(pjName);
                    var id = getNextId(self.projects,"_id");
                    self.projects.push(pj);
                    self.updateStatus();
                    self.projects[self.length - 1]._id = id;
                    return self.length - 1;
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
                return -1;
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
                    return JSON.parse($window.localStorage.projects);
                } catch(e) {
                    return [];
                }
            }

            function storeData () {
                try {
                    $window.localStorage.projects = JSON.stringify(self.projects);
                } catch(e) {
                    console.log("exception: " + e);
                }
                self.updateStatus();
            }

        }

        Projects.prototype = {
            projects : null,
            hasData  : false,

            getPjs : function() {
                return this.projects;
            }


        };



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
                storage     : 960,
                storageUnit : 'TB'
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
            this.local    = true;
        }

        this.NVRObj = function() {
            MyObj.call(this);
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
        };
        this.NVRObj.prototype = new MyObj();

        this.CMSObj = function() {
            MyObj.call(this);
            this.display.storage     = '-';
            this.display.storageUnit = '';
            this.remoteUsers = 10;
        };
        this.CMSObj.prototype = new MyObj();

    }]);
