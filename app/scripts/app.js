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



angular.element(document).ready(function () {
   if (window.cordova) {
     console.log("Running in Cordova, will bootstrap AngularJS once 'deviceready' event fires.");
     document.addEventListener('deviceready', function () {
       console.log('Deviceready event has fired, bootstrapping AngularJS.');
       angular.bootstrap(document.body, ['calculatorApp']);
     }, false);
   } else {
     console.log('Running in browser, bootstrapping AngularJS now.');
     angular.bootstrap(document.body, ['calculatorApp']);
   }
 });





// var app = {
//     // Application Constructor
//     initialize: function() {
//         this.bindEvents();
//     },
//     // Bind Event Listeners
//     //
//     // Bind any events that are required on startup. Common events are:
//     // 'load', 'deviceready', 'offline', and 'online'.
//     bindEvents: function() {
//         document.addEventListener('deviceready', this.onDeviceReady, false);
//     },
//     // deviceready Event Handler
//     //
//     // The scope of 'this' is the event. In order to call the 'receivedEvent'
//     // function, we must explicitly call 'app.receivedEvent(...);'
//     onDeviceReady: function() {
//         app.receivedEvent('deviceready');
//         angular.bootstrap(domElement, ["angularAppName"])
//     },
//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');

//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');

//         console.log('Received Event: ' + id);
//     }
// };

// app.initialize();

//--------- .end Cordova event setting ----------



angular
    .module('calculatorApp', [
        'ui.router',
        'ngResource',
        'ngAnimate',
        'ui.bootstrap',
        'ngCordova'
    ]);

