'use strict';

angular.module('MyApp')
    .service('storageFactory', ['$window', function($window) {


    /*****************************************
     *     Used when leaving the edit page
     */

        this.refresh = function() {
            var newPJ = new Projects();
            this.pj   = newPJ;
            newPJ     = null;
        };


    /*****************************************
     *         Class Projects
     */

        function Projects() {
            var self = this;

        //////////// Private
            function loadData() {
                try {
                    return JSON.parse($window.localStorage.projects);
                } catch (e) {
                    return [];
                }
            }

            self.projects = loadData();

        //////////// Public
            this.updateStatus = function() {
                self.length = self.projects.length;
                self.hasData = ( self.length > 0 );
            };

        //////////// Private
            self.updateStatus();

        //////////// Public
            this.renamePj = function(oldName, newName) {
                var indexN = getPjIndex(newName),
                    index  = getPjIndex(oldName);

                // Name already exists
                if ( -1 !== indexN ) {
                    return false;
                }

                self.projects[index].name = newName;
                storeData();
                return true;
            };

            this.renameItem = function(oldPjName, oldName, newName) {
                var indexP = getPjIndex(oldPjName),
                    index  = findByAttr( self.projects[indexP].data, 'name', oldName ),
                    indexN = findByAttr( self.projects[indexP].data, 'name', newName );

                // Name already exists
                if ( -1 !== indexN ) {
                    return false;
                }

                self.projects[indexP].data[index].name = newName;
                storeData();
                return true;
            };

            this.addItem = function(itemName, pjName, data, onNVR, overwrite) {
                var indexP = getPjIndex(pjName);
                var old    = self.projects[indexP];
                var index  = findByAttr( old.data, 'name', itemName );

                if ( -1 !== index ) { // The name already exists
                    if ( !overwrite ) { // 1st Round
                        return false;
                    } else {            // 2nd Round
                        self.deleteItem(old.data[index]._id, old._id);
                    }
                }

                var type = 'CMS';
                if ( onNVR ) {
                    data = str2Int(data);
                    type = 'NVR';
                }

                var id = getNextId(old.data, '_id');
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

            this.editItem = function(pId, itemId, data) {
                var indexP = findByAttr( self.projects, '_id', pId);
                var pj     = self.projects[indexP];
                var old    = loadData();
                var index  = findByAttr( pj.data, '_id', itemId);
                var oldData = old[indexP].data[index].data;

                displayCorrect( pj, oldData.display, data.display);
                storeData();
                return true;
            };

            this.getPj = function(id) {
                var index = findByAttr( self.projects, '_id', id);
                return self.projects[ index ];
            };

            this.getItem = function(pid, itemid) {
                var pindex = findByAttr( self.projects, '_id', pid);
                var index  = findByAttr( self.projects[pindex].data, '_id', itemid);
                return self.projects[ pindex ].data[ index ];
            };

            this.deletePj = function(id) {
                var index = findByAttr( self.projects, '_id', id);
                if ( -1 !== index ) {
                    self.projects.splice(index, 1);
                    self.updateStatus();
                    if ( !self.hasData ) {
                        $window.localStorage.removeItem('projects');
                    } else {
                        storeData();
                    }
                }
            };

            this.deleteItem = function(id, pid) {
                var indexP = findByAttr( self.projects, '_id', pid );
                var arr    = self.projects[indexP].data;
                var index  = findByAttr( arr, '_id', id);

                if ( -1 !== index ) {
                    var type = arr[index].type;
                    if ( 'NVR' === type ) {
                        self.projects[indexP].count.NVR--;
                        self.projects[indexP].storage -= arr[index].data.display.storage;
                    } else {
                        self.projects[indexP].count.CMS--;
                    }

                    self.projects[indexP].bandwidth -= arr[index].data.display.bandwidth;

                    arr.splice(index, 1);
                    storeData();
                }
            };


        //////////// Private
            function displayCorrect(pj, subtrahend, addend) {
                pj.storage   -= subtrahend.storage;
                pj.bandwidth -= subtrahend.bandwidth;
                pj.storage   += addend.storage;
                pj.bandwidth += addend.bandwidth;
            }

            function getPjIndex(pjName) {
                var index = findByAttr( self.projects, 'name', pjName );
                if ( -1 === index) {
                    var pj = new NewPJ(pjName);
                    var id = getNextId(self.projects,'_id');
                    self.projects.push(pj);
                    self.updateStatus();
                    self.projects[self.length - 1]._id = id;
                    return self.length - 1;
                }
                return index;
            }

            function str2Int(obj) {
                obj.cameras                = parseInt(obj.cameras);
                obj.estDays.params.motion  = parseInt(obj.estDays.params.motion);
                obj.estDays.params.rHours  = parseInt(obj.estDays.params.rHours);
                return obj;
            }

            function findByAttr(arr, attr, value) {
                for ( var i = 0, l = arr.length; i < l; i++ ) {
                    if ( arr[i][attr] === value ) {
                        return i;
                    }
                }
                return -1;
            }

            function getNextId(arr, attr) {
                var l = arr.length;
                if ( l > 0 ) {
                    for ( var i = 0; i < l; i++ ) {
                        if ( arr[i][attr] !== ( i + 1 ) ) {
                            return i;
                        }
                    }
                    return i + 1;
                }
                return 1;
            }



            function storeData() {
                try {
                    // $window.localStorage.projects = JSON.stringify(self.projects);
                    $window.localStorage.projects = JSON.stringify(self.projects, undefined, '\t');
                    console.log($window.localStorage.projects);
                } catch (e) {
                    console.log('exception: ' + e);
                }
                self.updateStatus();
            }

        }

        Projects.prototype = {
            projects : null,
            hasData  : false,
        };



    /*****************************************
     *         Class NewPJ
     */

        function NewPJ(pjName) {
            this._id       = 0;
            this.name      = pjName;
            this.storage   = 0;
            this.bandwidth = 0;
            this.data      = [];
            this.count     = {
                NVR: 0,
                CMS: 0
            };
        }



    /*****************************************
     *       Class CMS/NVR Data Object
     */

        function MyObj() {
            this.display = {
                storage   : 960,
                bandwidth : 64
            };
            this.cameras = 16;
            this.bitRate = {
                data: 4,
                params: {
                    codec      : 'H.264',
                    quality    : 'Medium',
                    resolution : 'Full HD (1920 x 1080)',
                    FPS        : 30
                }
            };
            this.local = true;
        }

        this.NVRObj = function() {
            MyObj.call(this);
            this.estDays = {
                data: 10,
                params: {
                  rDays : 30,
                  rHours: 16,
                  motion: 50
                }
            };
            this.RAID    = '5';
            this.HDDsize = '3 TB';
        };

        this.CMSObj = function() {
            MyObj.call(this);
            this.display.storage     = '-';
            this.display.storageUnit = '';
            this.remoteUsers = 10;
        };

        this.NVRObj.prototype = new MyObj();
        this.CMSObj.prototype = new MyObj();




    /*****************************************
     *          Initialization
     */

        this.pj    = new Projects();


    }]);
