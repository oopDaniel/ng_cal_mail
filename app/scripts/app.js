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
    'ngResource'
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
      });
      $urlRouterProvider.otherwise('/');
  });
  // .config(function ($routeProvider) {
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: 'views/main.html',
  //       controller: 'MainCtrl',
  //       controllerAs: 'main'
  //     })
  //     .when('/project', {
  //       templateUrl: 'views/project.html',
  //       controller: 'ProjectCtrl',
  //       controllerAs: 'project'
  //     })
  //     .otherwise({
  //       redirectTo: '/'
  //     });
  // });
