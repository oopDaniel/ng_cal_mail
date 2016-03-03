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
       angular.bootstrap(document.body, ['MyApp']);


     }, false);
   } else {
     console.log('Running in browser, bootstrapping AngularJS now.');
     angular.bootstrap(document.body, ['MyApp']);
   }
 });


angular
    .module('MyApp', [
        'ui.router',
        'ui.bootstrap',
        'ngCordova'
    ]);

