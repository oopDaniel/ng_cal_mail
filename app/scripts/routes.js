'use strict';

angular.module('MyApp')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderCtrl'
                    },
                    'content': {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl',
                        resolve: {
                            hasData1: function() {
                                return true;
                            }
                        }
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })

        .state('app.md', {
            url: 'md',
            views: {
                'content@': {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl',
                    resolve: {
                       hasData1: function() {
                            return false;
                        }
                    }
                }
            }
        })

        .state('app.list', {
            url: 'list',
            views: {
                'content@': {
                    templateUrl: 'views/project.html',
                    controller: 'ProjectCtrl'
                }
            }
        })

        ;
        $urlRouterProvider.otherwise('/');
    });
