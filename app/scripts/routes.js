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
                            isData1: function() {
                                return true;
                            }
                        }
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })

        .state('app.item1', {
            url: 'item1',
            views: {
                'content@': {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl',
                    resolve: {
                       isData1: function() {
                            return false;
                        }
                    }
                }
            }
        })

        .state('app.item2', {
            url: 'item2',
            views: {
                'content@': {
                    templateUrl: 'views/project.html',
                    controller: 'ProjectCtrl'
                }
            }
        })

        .state('app.projectdetails', {
            url: 'project/:id',
            views: {
                'content@': {
                    templateUrl: 'views/projectDetail.html',
                    controller: 'ProjectDetailCtrl'
                }
            }
        })
        ;
        $urlRouterProvider.otherwise('/');
    });
