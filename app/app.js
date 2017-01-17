'use strict';

angular.module('myApp', [
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true
  });

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'routes/home/home.html',
      controller: 'HomeCtrl'
    });

  $urlRouterProvider
    .otherwise('/');
});
