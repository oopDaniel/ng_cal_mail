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

            this.addItem = function( pjName, data, hasData1 ) {
                var index = findByAttr( self.projects, 'name', pjName );
                if ( index === -1 ) {
                    index = newPjIndex(pjName);
                }
                var pj = self.projects[index];
                var id = getNextId( pj, '_id');

                pj.mynum1 = data.mynum1,
                pj.mynum2 = data.mynum2,
                pj.sum    = data.sum,
                pj.diff   = data.diff

                storeData();
                return true;
            };


            this.getPj = function(id) {
                var index = findByAttr( self.projects, '_id', id);
                return self.projects[ index ];
            };


            function newPjIndex(pjName) {
                var pj = new NewPJ(pjName);
                var id = getNextId(self.projects,'_id');
                self.projects.push(pj);
                self.updateStatus();
                self.projects[self.length - 1]._id = id;
                return self.length - 1;
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
            hasData  : false
        };



    /*****************************************
     *         Class NewPJ
     */

        function NewPJ(pjName) {
            this._id       = 0;
            this.name      = pjName;
        }



    /*****************************************
     *          Initialization
     */

        this.pj    = new Projects();


    }]);
