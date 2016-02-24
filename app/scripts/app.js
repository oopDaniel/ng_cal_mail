'use strict';

/**
 * @ngdoc overview
 * @name calculatorApp
 * @description
 * # calculatorApp
 *
 * Main module of the application.
 */
angular
    .module('calculatorApp', [
        'ui.router',
        'ngResource',
        'ngAnimate',
        'ui.bootstrap'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html'
                    },
                    'content': {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
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
