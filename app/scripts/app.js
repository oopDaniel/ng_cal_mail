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

       // ---------- Ugly code start ---------
       // document.getElementsByTagName('header')[0].setAttribute('ng-controller','HeaderCtrl');
       // document.getElementById('header').setAttribute('ng-controller','HeaderCtrl');
       // ---------- Ends ugly code ----------

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

