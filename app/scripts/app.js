'use strict';

/**
 * @ngdoc overview
 * @name calculatorApp
 * @description
 * # calculatorApp
 *
 * Main module of the application.
 */




//------------- Cordova event setting --------------

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

//--------- .end Cordova event setting ----------



angular
    .module('calculatorApp', [
        'ui.router',
        'ngResource',
        'ngAnimate',
        'ui.bootstrap',
        'ngCordova'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderCtrl'
                    },
                    'content': {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl',
                        resolve: {
                            onNVR: function() {
                                return true;
                            }
                        }
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })

            .state('app.cms', {
                url:'cms',
                views: {
                    'content@': {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl',
                        resolve: {
                           onNVR: function() {
                                return false;
                            }
                        }
                    }
                }
            })

            .state('app.project', {
                url:'project',
                views: {
                    'content@': {
                        templateUrl: 'views/project.html',
                        controller: 'ProjectCtrl'
                    }
                }
            })

            .state('app.projectdetails', {
                url:'project/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/projectDetail.html',
                        controller: 'ProjectDetailCtrl'
                    }
                }
            })

            .state('app.item', {
                url:'project/:id/:itemid',
                views: {
                    'content@': {
                        templateUrl: 'views/item.html',
                        controller: 'ItemCtrl'
                    }
                }
            })

      ;
      $urlRouterProvider.otherwise('/');
  });
